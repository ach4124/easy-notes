import React from 'react';
import { connect } from 'react-redux';
import { createPost } from '../actions/postActions';
import { GithubPicker } from 'react-color';
import request from 'superagent';
import Button from 'react-bootstrap/lib/Button';
import UploadedFile from './UploadedFile';

const CLOUDINARY_UPLOAD_PRESET = 'idjdsfbj';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/momentumclone/upload';

class AddPostForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        title: '',
        content: '',
        tags: '',
        active: false,
        color: "#FFF",
        attachedFile: '',
        isUploading: false
      };
  }

  handleChange = (e) => {
      this.setState({[e.target.name]: e.target.value});
  }
  
  handleUpload(files) {
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
        this.setState({ attachedFile: response.body.secure_url, isUploading: false })
        document.getElementById("uploading").style.visibility = "hidden";
      }
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    var splitSpace = /:\s|,\s/;
    const post = {
        title: this.state.title,
        content: this.state.content,
        tags: this.state.tags ? this.state.tags.split(splitSpace) : [],
        color: this.state.color,
        active: this.state.active,
        attachedFile: this.state.attachedFile
    };
    this.props.createPost(post);
  }

  render() {

    

    return (
      <div className="note-container" style={{backgroundColor: this.state.color}}>
        {this.state.attachedFile && <UploadedFile url={this.state.attachedFile} oldPost={false}/>}
        <form onSubmit={this.onSubmit}>
          <div className="padding-20">
            <input
              className="Input"
              type="content"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              placeholder="Title (optional)"
            />
            <br />
            <textarea
              rows="10"
              cols="100"
              type="text"
              name="content"
              value={this.state.content}
              onChange={this.handleChange}
              placeholder="Content"
              required/>
            <br />
            <input className="Input inline" name="tags" value={this.state.tags} onChange={this.handleChange} placeholder="Tags (optional)"/><br/>
            <Button onClick={() => this.setState({ active: !this.state.active })}>
              <input className="" type="checkbox" checked={this.state.active} onChange={()=>{}}/> Set as active
            </Button>
            <Button className="cursor-pointer inline" title="Upload a file or drop a file on any post">
              <label>
                <i className="glyphicon glyphicon-cloud-upload"/>
                <input id="file-upload" type="file" onChange={(e) => this.handleUpload(e.target.files[0])}/>
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
                    this.setState({color: color.hex});
                  }} />
              </div>
            </div>
            <div>
              <Button bsStyle="primary" bsSize="small" type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(null, { createPost })(AddPostForm);