import React from 'react';
import { connect } from 'react-redux';
import Posts from './Posts';
import AddPostForm from './AddPostForm';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

const SearchAndOr = (props) => (
  <ButtonToolbar className="right">
    <ButtonGroup bsSize="small" >
      <Button bsStyle={props.andSearch ? "primary" : "default"}
        onClick={() => props.changeSearch("and")}>
        and
      </Button>
      <Button bsStyle={props.andSearch ? "default" : "primary"}
        style={{border: "1px solid #AAA", marginRight: 10}}
        onClick={() => props.changeSearch("or")}>
        or
      </Button>
    </ButtonGroup>
  </ButtonToolbar>
);

const FlexCustom = (props) => {
  return(
    <ButtonToolbar>
      <ButtonGroup bsSize="small" >
        <Button bsStyle="primary" onClick={() => props.changeFlex("50%")}>1</Button>
        <Button bsStyle="primary" onClick={() => props.changeFlex("40%")}>2</Button>
        <Button bsStyle="primary" onClick={() => props.changeFlex("30%")}>3</Button>
        <Button bsStyle="primary" onClick={() => props.changeFlex("20%")}>4</Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
};

class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addPost: false,
      searchText: '',
      andSearch: true,
      flex: '',
    };
  }
  
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  changeFlex(percentage){
    var containers = document.getElementsByClassName("note-container");
    for (var i = 0; i < containers.length; i++) {
      containers[i].style.msFlex = percentage;  // IE10
      containers[i].style.flex = percentage;
    }
    var colorPicker = document.getElementsByClassName("picker");
    if (percentage === "30%" || percentage === "20%"){
      for (var j = 0; j < colorPicker.length; j++) {
        colorPicker[j].style.display = "none";
      }
    } else {
      for (var k = 0; k < colorPicker.length; k++) {
        colorPicker[k].style.display = "inline";
      }      
    }
  }

  changeSearch = (type) => {
    this.setState({ andSearch: type === "and" ? true : false })
  }

  toggleAddPost = () => {
    this.setState({ addPost: !this.state.addPost })
  }

  render() {
    const { posts } = this.props;
    const { searchText } = this.state; 
    var splitSpace = /:\s|,\s/;
    if (searchText){
      var filteredItems = posts.filter(post => {
        var postContent = post.content && post.content.toLowerCase();
        var textArray = searchText && searchText.toLowerCase().split(splitSpace);
        if (this.state.andSearch){
          return textArray.every(word => postContent.indexOf(word) > -1); 
        } else {
          return textArray.some(word => postContent.indexOf(word) > -1); 
        }
      });
    }
    const postItems = searchText ? filteredItems : posts;
    return (
      <div className="container">
        <div className="form-group has-feedback width-35 right">
          {" "}<i className="glyphicon glyphicon-search form-control-feedback"></i>
          <input
            type="text"
            className="form-control"
            name="searchText"
            onChange={this.handleChange}
            placeholder="Search"
          />
        </div>
        <SearchAndOr andSearch={this.state.andSearch} changeSearch={this.changeSearch}/>
        <FlexCustom changeFlex={this.changeFlex}/><br/>
        <Button bsStyle="default" bsSize="small" onClick={this.toggleAddPost}>Add a post</Button>
        {this.state.addPost && <AddPostForm/>}
        <hr/>
        <Posts allPosts={postItems} posts={postItems} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts.items,
});

export default connect(mapStateToProps, null)(PostForm);