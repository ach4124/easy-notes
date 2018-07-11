import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPosts, selectPost, unselectPost, selectAll, unselectAll, removePost, filterPosts, updatePost } from '../actions/postActions';
import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';
import Table from 'react-bootstrap/lib/Table';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

const Checkbox = (props) => (
  <td style={{ width: "7%", textAlign: "center"}}>
    <input
      type="checkbox"
      checked={props.selectedIDs.includes(props.id)}
      onChange={()=>{}}
    />
  </td>
);

const Date = (props) => (
  <td>{props.createdAt && props.createdAt.slice(0,10)}</td>
);


const Note = (props) => (
  <td style={{width: "88%", textDecorationLine: props.active ? 'underline' : 'none'}}>
    {(props.title && props.title) || props.content.substr(0,100) + "..."}{" "}
    <span className="tags">
      {props.tags.length>0 && props.tags.map((tag, i, arr) => {
        if (arr.length === i + 1){
          return tag
        } else {
          return `${tag}, `
        }
      })}
    </span>{" "}
    {props.active && <i className="glyphicon glyphicon-pencil"/>}
  </td>
);

const DeleteButton = (props) => (
  <Button title="Delete post(s)" onClick={() => {
    if (window.confirm("Are you sure you want to delete the selected posts?")){
      for (var i = 0; i < props.selectedIDs.length; i++) {
        props.removePost(props.selectedIDs[i]);
      }
    } else {
      return false;
    }
  }}>
    <i className="glyphicon glyphicon-trash"/>
  </Button>
);

const TagButton = (props) => (
  <DropdownButton id="tags-dropdown" title={<i className="glyphicon glyphicon-tags"/>} noCaret>
    <MenuItem onClick={() => props.updateTag(props.tagPrompt())}>+ New Tag</MenuItem>
    <MenuItem divider/>
    {props.tagArray.map((tag) =>
      <MenuItem key={tag} onClick={() => props.updateTag(tag)}>
        {tag}
      </MenuItem>)}
  </DropdownButton>
);

const FilterButton = (props) => (
  <DropdownButton
    bsStyle="default"
    title="Filter with Tags"
    id="tag-filter-dropdown"
    noCaret
  >
    <MenuItem onClick={() => props.searchTag("")}>Show All</MenuItem>
    {props.tagArray.map(tag =>
      <MenuItem
        key={tag}
        style={{backgroundColor: props.filterText === tag ? "#EEE" : "transparent"}}
        onClick={() => props.searchTag(tag)}
      >
        {tag}
      </MenuItem>)}
  </DropdownButton>
);

const ActiveButton = (props) => (
  <Button onClick={props.makeActive}>Make Active</Button>
);

const NumberButton = (props) => {
  var pageArray = [], postsArray = [];
  var changeNumberArray = [10, 25, 50, 100];
  var pages = props.length > props.numberPerPage ? Math.ceil(props.length / props.numberPerPage) : 1;
  for (var j = 0; j < pages; j++){
    pageArray.push(j + 1);
  }
  if (pages > 1){
    for (var i = 0; i < pages; i++){
      if (props.length < props.numberPerPage * (i+1)){
        (i * props.numberPerPage + 1 === props.length) ? postsArray.push(`${props.length}`) :
        postsArray.push(`${i * props.numberPerPage + 1}-${props.length}`);
      } else {
        postsArray.push(`${i * props.numberPerPage + 1}-${props.numberPerPage * (i+1)}`);
      }
    }
  }
  return (
    <div className="right">
      {props.length > props.numberPerPage ? `${postsArray[props.page-1]} of ${props.length} ` : `1-${props.length} `}
      <Button style={{color: "#CCC"}} onClick={props.prevPage} disabled={props.page === 1 || pages === 1}>
        <i className="glyphicon glyphicon-chevron-left"/>
      </Button>
      <DropdownButton
        bsStyle="default"
        title={props.page}
        id="page-dropdown"
        noCaret
      >
        {pageArray.map(page => 
          <MenuItem
            key={"page"+page}
            onClick={() => props.changePage(page)}
          >{page}
          </MenuItem>)}
      </DropdownButton>
      <Button
        style={{color: "#CCC"}}
        onClick={props.nextPage}
        disabled={pages === props.page}
      >
        <i className="glyphicon glyphicon-chevron-right"/>
      </Button>
      <DropdownButton
        bsStyle="default"
        title={props.numberPerPage}
        id="numberperpage-dropdown"
        noCaret
      >
        {changeNumberArray.map(number =>
          <MenuItem
            key={"npp" + number}
            onClick={() => {
              props.changeNumberPerPage(number);
              props.changePage(1)}}>
            {number}
          </MenuItem>)}
      </DropdownButton>
    </div>
  );
}

class PostsManager extends React.Component {
  state = {
    page: 1,
    numberPerPage: 10
  }

  componentWillMount() {
    this.props.fetchPosts();
  }

  searchTag = (tag) => {
    this.props.filterPosts(tag);
  }

  handleRowClick = (selectedIDs, post) => {
    if (selectedIDs.includes(post._id)){
      this.props.unselectPost(post, post._id);
    } else {
      this.props.selectPost(post, post._id);
    }
  }
  
  checkAll = () => {
    var table = document.getElementById("manager");
    var checkAll = table.querySelector('input[name="checkAll"]');
    var inputs = table.querySelectorAll('tbody>tr>td>input');
    checkAll.addEventListener('change', () => {
      if (checkAll.checked){
        this.props.selectAll();
        inputs.forEach(input => input.checked = true)
      } else {
        this.props.unselectAll();
        inputs.forEach(input => input.checked = false)
      }
    });
  }

  updateTag = (tag) => {
    const { selectedIDs, posts } = this.props;
    for (var i = 0; i < selectedIDs.length; i++) {
      var index = posts.map(e => e._id).indexOf(selectedIDs[i]);
      const newTagArray = posts[index].tags.includes(tag) ?
        posts[index].tags.filter(newTag => newTag !== tag) :
        [...posts[index].tags, tag];
      const updatedPost = Object.assign({}, posts[index], {tags: newTagArray});
      this.props.updatePost(updatedPost, selectedIDs[i]);
    }
  }

  makeActive = () => {
    const { selectedIDs, posts } = this.props;
    for (var i = 0; i < selectedIDs.length; i++) {
      var index = posts.map(e => e._id).indexOf(selectedIDs[i]);
      const updatedPost = Object.assign({}, posts[index], {active: !posts[index].active});
      this.props.updatePost(updatedPost, selectedIDs[i]);
    }
  }

  tagPrompt = () => {
    var newTag = window.prompt("Enter a new tag", "");
    return newTag;
  }

  changePage = (pageNumber) => {
    this.setState({page: pageNumber})
  }

  changeNumberPerPage = (number) => {
    this.setState({numberPerPage: number})
  }

  prevPage = () => {
    this.setState({page: this.state.page - 1});
  }

  nextPage = () => {
    this.setState({page: this.state.page + 1});
  }

  render() {
    const { posts, selectedIDs, filterText } = this.props;
    const { page, numberPerPage } = this.state;

    // get an array with unique tags
    const tagArrays = posts.map(post => post.tags);
    const tagsConcated = tagArrays.reduce((a, b) => a.concat(b), []);
    const tagArray = [...new Set(tagsConcated)];
    
    // filter posts with tags on button click
    var filteredItems = posts.filter(post => post.tags.includes(filterText));
    
    // show 10 (default) posts per page
    const partitionArray = (array, size) => array.map( (e,i) => (i % size === 0) ? array.slice(i, i + size) : null ).filter( (e) => e )
    const pageArray = posts && partitionArray(posts, numberPerPage);

    // can be used for both unfiltered and filtered posts
    const postBody = (posts) => (posts.map((post) => (
      <tr key={post._id}
        onClick={() => this.handleRowClick(selectedIDs, post)}>
        <Checkbox id={post._id} selectedIDs={selectedIDs}/>
        <Note title={post.title} content={post.content} tags={post.tags} active={post.active}/>
        <Date createdAt={post.createdAt}/>
      </tr>
    )));

    return (
      <div className="container">
        {posts.length === 0 && <div>There aren't any posts...</div>}
        {posts.length > 0 &&
        <div>
          {selectedIDs.length > 0 && <Alert bsStyle="info">{selectedIDs.length} selected</Alert>}
          <DeleteButton selectedIDs={selectedIDs} removePost={this.props.removePost}/>
          <TagButton tagArray={tagArray} tagPrompt={this.tagPrompt} updateTag={this.updateTag}/>
          <FilterButton tagArray={tagArray} searchTag={this.searchTag} filterText={filterText}/>
          <ActiveButton makeActive={this.makeActive}/>
          <NumberButton
            page={page}
            numberPerPage={numberPerPage}
            length={posts.length}
            changePage={this.changePage}
            prevPage={this.prevPage}
            nextPage={this.nextPage}
            changeNumberPerPage={this.changeNumberPerPage}
          />
          <Table id="manager">
            <thead>
              <tr>
                <th style={{ width: "7%", textAlign: "center"}}>
                  <input name="checkAll" type="checkbox" title="Select All"
                  onClick={this.checkAll}/>
                </th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filterText ? postBody(filteredItems) : postBody(pageArray[page-1])}
            </tbody>
          </Table>
        </div>
        }
      </div>
    );
  }
}

PostsManager.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
  selectPost: PropTypes.func.isRequired,
  unselectPost: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  unselectAll: PropTypes.func.isRequired,
  removePost: PropTypes.func.isRequired,
  filterPosts: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  posts: state.posts.items,
  selectedIDs: state.posts.selectedIDs,
  filterText: state.posts.filterText
});

export default connect(mapStateToProps, { fetchPosts, selectPost, unselectPost, selectAll, unselectAll, removePost, filterPosts, updatePost })(PostsManager);