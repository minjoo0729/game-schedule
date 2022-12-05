import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import "./css/game.css";
import EditGame from "./editgame";

interface IAPIResponse  { _id: string, title: string, date: string, time: string, memo: string, itemViewCnt: number }

const GamePage = (props: {}) => {
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(30);
  const [ SNewPostTitle, setSNewPostTitle ] = React.useState<string>("");
  const [ SNewPostDate, setSNewPostDate ] = React.useState<string>("");
  const [ SNewPostTime, setSNewPostTime ] = React.useState<string>("");
  const [ SNewPostScore, setSNewPostScore ] = React.useState<string>("");
  const [ SNewPostMemo, setSNewPostMemo ] = React.useState<string>("");
  const [ SSearchItem, setSSearchItem ] = React.useState<string>("");
  const [ Edited, setEdited ] = React.useState<boolean>(false);

  React.useEffect( () => {
    if ( Edited ) setEdited(false);
    else {
      let BComponentExited = false;
      const asyncFun = async () => {
        const { data } = await axios.get<IAPIResponse[]>( SAPIBase + `/game/getGame?count=${ NPostCount }&search=${ SSearchItem }`);
        console.log(data);
        if (BComponentExited) return;
        setLAPIResponse(data);
      };
      asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
      return () => { BComponentExited = true; }
    }
  }, [ NPostCount, SSearchItem, Edited ]);

  const createNewPost = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/game/addGame', { title: SNewPostTitle, date:SNewPostDate, time:SNewPostTime, score: SNewPostScore, memo: SNewPostMemo } );
      setNPostCount(NPostCount + 1);
      setSNewPostTitle("");
      setSNewPostDate("");
      setSNewPostTime("");
      setSNewPostScore("");
      setSNewPostMemo("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/game/deleteGame', { id: id } );
      setNPostCount(Math.max(NPostCount - 1, 0));
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const editPost = (id:string, title:string, date:string, time:string, score:string, memo:string) => {
    const asyncFun = async () => {
      await axios.put( SAPIBase + '/game/editGame', { id, title, date, time, score, memo } );
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
    setEdited(true);
  }

  return (
    <div className="Game">
      <h2>Match Schedules</h2>
      
      <div className={"game-search-input"}>
        Search : &nbsp;
        <input type={"text"} value={ SSearchItem } id={"post-search-input"}
               onChange={ (e) => setSSearchItem( e.target.value ) }
        />
      </div>
      <br/>
      <form className={"game-item-add"} onSubmit={(e) => {
        e.preventDefault();
        createNewPost();
      }}>
        <b>*Match Title: <input required type={"text"} value={SNewPostTitle} onChange={(e) => setSNewPostTitle(e.target.value)}/></b>
        <br/>
        *Date: <input required type={"date"} value={SNewPostDate} onChange={(e) => setSNewPostDate(e.target.value)}/>
        &nbsp;&nbsp;&nbsp;&nbsp;
        *Time: <input required type={"time"} value={SNewPostTime} onChange={(e) => setSNewPostTime(e.target.value)}/>
        <br/>
        Score: <input type={"text"} value={SNewPostScore} onChange={(e) => setSNewPostScore(e.target.value)}/>
        <br/>
        Memo: <input type={"text"} value={SNewPostMemo} onChange={(e) => setSNewPostMemo(e.target.value)} />
        <br/>
        <button className={"post-add-button"} >Add Game!</button>
      </form>
      <div className={"game-list"}>
        { LAPIResponse.map( (val, i) =>
          <EditGame val={val} i={i} deletePost={deletePost} editPost={editPost} />
        ) }
      </div>
    </div>
  );
}

export default GamePage;