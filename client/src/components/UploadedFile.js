import React from 'react';

const UploadedFile = (props) => {
    const urlLength = props.url.length;
    const type = props.url && props.url.substr(urlLength-4,urlLength);
    if (type === ".png" || type === ".jpg" || type === ".jpeg" || type === ".gif"){
    return (
      <span className="image-container">
        <img className="image" src={props.url} alt="Uploaded file"/>
        {props.oldPost && <div
          className="delete"
          title="Delete file"
          onClick={() => {
            const updatedPost = Object.assign({}, props.post, {attachedFile: null});
            props.updatePost(updatedPost, props.id);
          }}
        ><i className="glyphicon glyphicon-trash"/></div>}
      </span>
    )} else if (type === ".mp3"){
      return (
        <audio className="audio" controls>
          <source src={props.url} type="audio/mpeg"/>
        </audio>
      );
    } else if (type === ".mp4"){
      return (
        <video width="320" height="240" className="video" controls>
          <source src={props.url} type="video/mp4"/>
        </video>);
    } else {
      return (<div>File type not supported</div>);
    }
}

export default UploadedFile;