import React, {useState, useEffect} from "react";

const EditGame = ({ val, i, deletePost, editPost }) => {
  const [ isEditing, setIsEditing ] = useState(false);
  const [ ID, setID ] = useState(val._id);
  const [ postTitle, setPostTitle ] = useState(val.title);
  const [ postDate, setPostDate ] = useState(val.date);
  const [ postTime, setPostTime ] = useState(val.time);
  const [ postScore, setPostScore ] = useState(val.score);
  const [ postMemo, setPostMemo ] = useState(val.memo);

  if( val._id !== ID ) {
    setID(val._id);
    setIsEditing(false);
    setPostTitle(val.title);
    setPostDate(val.date);
    setPostTime(val.time);
    setPostScore(val.score);
    setPostMemo(val.memo);
  }

  useEffect(() => {
    if( !isEditing ) {
      if( !(postTitle === val.title && postDate === val.date && postTime === val.time && postScore === val.score && postMemo === val.memo) ) {
        editPost(ID, postTitle, postDate, postTime, postScore, postMemo);
      }
    } // eslint-disable-next-line
  }, [ isEditing ]);

  return (
    isEditing ?
    (<div key={i} className={"game-item"}>
      <button className={"delete-item"} onClick={(e) => deletePost(`${ID}`)}>Delete</button>
      <button className={"edit-item"} onClick={(e) => setIsEditing(!isEditing)}>Save</button>
      <h3>
        <input className={"game-title"} type={"text"} value={postTitle} onChange={(e) => setPostTitle(e.target.value)}/>
      </h3>
      <p>
        Date : <input className={"game-date"} type={"text"} value={postDate} onChange={(e) => setPostDate(e.target.value)}/>
      </p>
      <p>
        Kickoff : <input className={"game-time"} type={"text"} value={postTime} onChange={(e) => setPostTime(e.target.value)}/>
      </p>
      <p>
        Score : <input className={"game-score"} type={"text"} value={postScore} onChange={(e) => setPostScore(e.target.value)}/>
      </p>
      <p>
        Memo : <input className={"game-memo"} type={"text"} value={postMemo} onChange={(e) => setPostMemo(e.target.value)}/>
      </p>
    </div>) :
    (<div key={i} className={"game-item"}>
    <button className={"delete-item"} onClick={(e) => deletePost(`${ID}`)}>Delete</button>
      <button className={"edit-item"} onClick={(e) => setIsEditing(!isEditing)}>Edit</button>
      <h3 className={"game-title"}>{ postTitle }</h3>
      <p className={"game-date"}><b>Date</b> : [ { postDate } ] &nbsp;&nbsp; <b>Kickoff</b> : [ { postTime } ]</p>
      <p className={"game-score"}>Score : [ { postScore } ]</p>
      <p className={"game-memo"}>Memo : { postMemo }</p>
    </div>)
  )
}

export default EditGame;