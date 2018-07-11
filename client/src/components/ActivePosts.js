import React from 'react';
import { connect } from 'react-redux';
import Posts from './Posts';
import AddPostForm from './AddPostForm';
import Button from 'react-bootstrap/lib/Button';

class ActivePosts extends React.Component {
  state = {
    addPost: false
  }

  toggleAddPost = () => {
    this.setState({ addPost: !this.state.addPost })
  }
  
  render() {
    const { posts } = this.props;
    const activePosts = posts.filter(post => post.active === true);
    return (
    <div className="container">
      <Button bsStyle="default" bsSize="small" onClick={this.toggleAddPost}>Add a post</Button>
      {this.state.addPost && <AddPostForm/>}
      <hr/>
      <Posts posts={activePosts}/>
    </div>      
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts.items,
});

export default connect(mapStateToProps, null)(ActivePosts);;