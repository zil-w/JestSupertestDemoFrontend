import { createStore, combineReducers, applyMiddleware} from 'redux'
import reducers from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

const reducer = combineReducers({
    notification: reducers.notificationReducer,
    blogs: reducers.blogReducer,
    user: reducers.userReducer,
    users: reducers.usersReducer
})

const store = createStore(reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)

export default store