import { combineReducers } from 'redux-immutable'
import { reducer as BaseReducer } from './base'
import { reducer as LayoutReducer } from '../views/Layout/store'
import { reducer as ButtonReducer } from '../views/pages/general/Button/store'

  
const editItemDef = {
  productname: 'xx',
  productmodel: 'yy'
};

const editRecordDef = {
  editItem:editItemDef
}



const editRecordReducer = (state = editRecordDef, action) => {
  console.log("editRecordReducer",action)
  switch (action.type) {
    case 'SET_PROD_EDIT_RECORD':
      return {
        ...state,
        editItem: action.payload.item
      };
    default:
      return state;
  }
};

export default combineReducers({
  base: BaseReducer,
  layout: LayoutReducer,
  button: ButtonReducer,
  editRecord:editRecordReducer
})
