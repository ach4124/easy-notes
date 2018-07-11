import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchPosts, removePost, updatePost } from '../actions/postActions';
import EditableTextarea from './EditableTextarea';
import EditableText from './EditableText';
import { GithubPicker } from 'react-color';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';
import UploadedFile from './UploadedFile';

const CLOUDINARY_UPLOAD_PRESET = 'idjdsfbj';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/momentumclone/upload';

const EditableContent = (props) => (<div>
  <EditableTextarea
    onBlur={(e) => {
      const updatedPost = Object.assign({}, props.post, {content: e.target.value || "     "});
      props.updatePost(updatedPost, props.id);
      clearInterval(this.timerID);
    }}
    onFocus={(e) => {
      const updatedPost = Object.assign({}, props.post, {content: e.target.value || "     "});
      this.timerID = setInterval(() => {
        props.updatePost(updatedPost, props.id, props.i);
        document.getElementById('msg').style.visibility = "visible";
        setTimeout(() => {
          document.getElementById('msg').style.visibility = "hidden";
          },2000);
        },60000);
      document.getElementById("note").style.height = "10em";
      document.getElementById("note").style.height = (25 + document.getElementById("note").scrollHeight) + "px";

    }}>
    {props.content}
  </EditableTextarea>
  </div>
);

const EditableTitle = (props) => (
  <div>
    {props.title && <u>
      <EditableText
        onBlur={(e) => {
          const updatedPost = Object.assign({}, props.post, {title: e.target.value});
          props.updatePost(updatedPost, props.id);
        }}>
        {props.title}
      </EditableText></u>}
  </div>
);


const PostCustom = (props) => (
  <span className="post-custom">
    <Button
      title={props.active ? "Set unactive" : "Set active"}
      style={{color: props.active ? "#000" : "#CCC"}}
      onClick={() => {
        const updatedPost = Object.assign({}, props.post, {active: !props.active});
        props.updatePost(updatedPost, props.id);}}>
      <i className="glyphicon glyphicon-pencil"/>
    </Button>
    <Button
      className="cursor-pointer inline"
      title="Delete post"
      onClick={() => props.removePost(props.id)}>
      <i className="glyphicon glyphicon-trash"/>
    </Button>
    <Button className="cursor-pointer inline" title="Upload a file or drop a file on any post">
      <label>
        <i className="glyphicon glyphicon-cloud-upload"/>
        <input id="file-upload" type="file" onChange={(e)=>props.handleUpload(props.id, props.post, e.target.files[0])}/>
      </label>
    </Button>
    <div className="picker inline">
      <Button id="color" className="cursor-pointer inline">
        <i className="glyphicon glyphicon-text-background"/>
      </Button>
      <div className="color-picker">
        <GithubPicker
          width={320}
          triangle="hide"
          colors={['#B80000', '#DB3E00', '#FF9333', '#FCCB00', '#FFFF00', '#00FFC9', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#002AA2',
          '#EB9694', '#FAD0C3', '#FFD1A8', '#FEF3BD', '#FFFFB0', '#BAFFD6', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB', '#A1B0DC']}
          onChangeComplete={(color) => {
            const updatedPost = Object.assign({}, props.post, {color: `${color.hex}`});
            props.updatePost(updatedPost, props.id);
          }} />
      </div>
    </div>
  </span>
);

const Tags = (props) => (
  <div>
    {props.tags && props.tags.map(tag =>
      <div className="Label inline" key={tag}>
        {tag}
      </div>)}
  </div>
);

const CreatedDate = (props) => (
  <div>{props.createdAt && props.createdAt.slice(0,10)}</div>
);

class Posts extends Component {
  state = {
    isUploading: false
  }

  componentWillMount() {
    this.props.fetchPosts();
  }

  handleUpload = (id, post, files) => {
    if (files && (files.type.includes("image") || files.type === "audio/mp3" || files.type === "video/mp4")){
      this.setState({ isUploading: true });
      document.getElementById('uploading').style.visibility = "visible";
      let upload = request.post(CLOUDINARY_UPLOAD_URL)
                      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                      .field('file', files);
      upload.end((err, response) => {
        if (err) {
          console.error(err);
        }
        if (response.body.secure_url !== '') {
          const updatedPost = Object.assign({}, post, {attachedFile: response.body.secure_url});
          this.props.updatePost(updatedPost, id);
          this.setState({ isUploading: false });
          document.getElementById("uploading").style.visibility = "hidden";
        }
      });
    }
  }
  
  render() {

    const { posts, updatePost, removePost } = this.props;
    const noPost = posts.length === 0 && <div>There are no posts...</div>
    const renderPosts = posts.length > 0 && posts.map((post, i) => (
      <Dropzone
        className="note-container"
        key={post._id}
        style={{backgroundColor: post.color}}
        onDrop={(files) => {
          this.handleUpload(post._id, post, files)
        }}
        multiple={true}
        accept="audio/*,video/*,image/*"
        disableClick={true}>
        {post.attachedFile && <UploadedFile url={post.attachedFile} updatePost={updatePost} id={post._id} post={post} oldPost={true}/>}
        <div className="padding-20">
          <CreatedDate createdAt={post.createdAt}/>
          <EditableTitle post={post} id={post._id} title={post.title} updatePost={updatePost}/> 
          <EditableContent post={post} id={post._id} content={post.content} updatePost={updatePost}/>
          <Tags tags={post.tags}/>
          <PostCustom handleUpload={this.handleUpload} post={post} active={post.active} id={post._id} i={i} removePost={removePost} updatePost={updatePost}/>
        </div>
      </Dropzone>
    ));
    
    return (
      <div className="row">
        {noPost}
        {renderPosts}
        <Alert id="msg">Post saved...</Alert>
        <Alert id="uploading">Uploading...</Alert>
      </div>
    );
  }
}

Posts.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
  removePost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
};

export default connect(null, { fetchPosts, removePost, updatePost })(Posts);