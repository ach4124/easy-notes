import { FETCH_POSTS, NEW_POST, REMOVE_POST, UPDATE_POST, SELECT_POST, UNSELECT_POST, SELECT_ALL, UNSELECT_ALL, FILTER_POSTS } from './types';

const obj = JSON.parse(localStorage.getItem('app'))||{};
const { token } = obj;

export const fetchPosts = () => dispatch => {
  fetch('/notes', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  })
    .then(res => res.json())
    .then(posts => {
      dispatch({
        type: FETCH_POSTS,
        payload: posts
      });
    })
  };

export const createPost = postData => dispatch => {
  fetch('/notes', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(post => {
      dispatch({
        type: NEW_POST,
        payload: post
      });
    })
  };

export const removePost = (id) => dispatch => {
  fetch(`/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token
    },
  })
    .then(res => res.json())
    .then(post => {
      dispatch({
        type: REMOVE_POST,
        id,
      });
    })
  };

export const updatePost = (postData, id) => dispatch => {
  fetch(`/notes/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(post => {
      dispatch({
        type: UPDATE_POST,
        payload: post,
      });
    })
  };

export const selectPost = (post, id) => dispatch => {
  dispatch({
    type: SELECT_POST,
    post,
    id
  })
};

export const unselectPost = (post, id) => dispatch => {
  dispatch({
    type: UNSELECT_POST,
    post,
    id
  })
};

export const selectAll = () => dispatch => {
  dispatch({
    type: SELECT_ALL,
  })
};

export const unselectAll = () => dispatch => {
  dispatch({
    type: UNSELECT_ALL,
  })
};

export const filterPosts = (filter) => dispatch => {
  dispatch({
    type: FILTER_POSTS,
    text: filter
  })
};