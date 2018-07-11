import { FETCH_POSTS, NEW_POST, REMOVE_POST, UPDATE_POST, SELECT_POST, UNSELECT_POST, SELECT_ALL, UNSELECT_ALL, FILTER_POSTS } from '../actions/types';

const initialState = {
  items: [],
  selectedIDs: [],
  filterText: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS:
      return {
        ...state,
        items: action.payload
      };
    case NEW_POST:
      return {
        ...state,
        items: [action.payload, ...state.items],
        filterText: '',
      };
    case REMOVE_POST:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.id),
        selectedIDs: state.selectedIDs.filter(item => item !== action.id)
    };
    case UPDATE_POST:
    var index = state.items.map(e => e._id).indexOf(action.payload._id);
      return {
        ...state,
        items: [
          ...state.items.slice(0, index),
          action.payload,
          ...state.items.slice(index + 1)
      ],
    };
    case SELECT_POST:
      return {
        ...state,
        selectedIDs: [...state.selectedIDs, action.id],
      };
    case UNSELECT_POST:
      return {
        ...state,
        selectedIDs: state.selectedIDs.filter(item => item !== action.id),
      };
    case SELECT_ALL:
      return {
        ...state,
        selectedIDs: state.items.map(post => post._id),
      };
    case UNSELECT_ALL:
      return {
        ...state,
        selectedIDs: [],
      };
    case FILTER_POSTS:
      return {
        ...state,
        filterText: action.text,
      };
    default:
      return state;
  }
}