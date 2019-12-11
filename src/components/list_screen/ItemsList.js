import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemCard from './ItemCard';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { getFirestore } from 'redux-firestore';

const ItemSortCriteria = {
    SORT_BY_TASK_INCREASING: "sort_by_task_increasing",
    SORT_BY_TASK_DECREASING: "sort_by_task_decreasing",
    SORT_BY_DUE_DATE_INCREASING: "sort_by_due_date_increasing",
    SORT_BY_DUE_DATE_DECREASING: "sort_by_due_date_decreasing",
    SORT_BY_STATUS_INCREASING: "sort_by_status_increasing",
    SORT_BY_STATUS_DECREASING: "sort_by_status_decreasing"
}

class ItemsList extends React.Component {
    state = {
        currentItemSortCriteria: ""
    }
    constructor(props) {
        super(props);
    
        this.compare = this.compare.bind(this);
        this.isCurrentItemSortCriteria = this.isCurrentItemSortCriteria.bind(this);
    }

    /**
     * This method sorts the todo list items according to the provided sorting criteria.
     * 
     * @param {ItemSortCriteria} sortingCriteria Sorting criteria to use.
     */
    sortTasks(sortingCriteria) {
        this.setState({currentItemSortCriteria: sortingCriteria}, function(){
            //this.props.todoList.items.sort(this.compare);
            const fireStore = getFirestore();
            fireStore.collection("todoLists").doc(this.props.todoList.id).update( {
                sortCriteria : this.state.currentItemSortCriteria
            });
            let itemList = this.props.todoList.items.sort(this.compare);
            // update key/id
            for (let i = 0; i<itemList.length; i++) {
                itemList[i].id = i;
            }
            // update database
            fireStore.collection("todoLists").doc(this.props.todoList.id).update( {
                items : itemList
            });
            
        });
        
    }

    /**
     * This method tests to see if the current sorting criteria is the same as the argument.
     * 
     * @param {ItemSortCriteria} testCriteria Criteria to test for.
     */
    isCurrentItemSortCriteria(testCriteria) {
        return this.state.currentItemSortCriteria === testCriteria;
    }

    /**
     * This method compares two items for the purpose of sorting according to what
     * is currently set as the current sorting criteria.
     * 
     * @param {TodoListItem} item1 First item to compare.
     * @param {TodoListItem} item2 Second item to compare.
     */
    compare(item1, item2) {
        // IF IT'S A DECREASING CRITERIA SWAP THE ITEMS
        if (this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_DECREASING)
            || this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_DECREASING)
            || this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING)) {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        if (this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_INCREASING)
            || this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_DECREASING)) {
            if (item1.description < item2.description)
                return -1;
            else if (item1.description > item2.description)
                return 1;
            else
                return 0;
        }
        // SORT BY DUE DATE
        if(this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING)
            || this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING)) {
            if (item1.due_date < item2.due_date)
                return -1;
            else if (item1.due_date > item2.due_date)
                return 1;
            else
                return 0;
        }
        // SORT BY COMPLETED
        //else {
        if(this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_INCREASING)
            || this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_DECREASING)) {
            if (item1.completed < item2.completed)
                return -1;
            else if (item1.completed > item2.completed)
                return 1;
            else
                return 0;
        }    
    }

    taskSort = (e) => {
        if(this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_INCREASING)) {
            this.sortTasks(ItemSortCriteria.SORT_BY_TASK_DECREASING);
        } else {
            this.sortTasks(ItemSortCriteria.SORT_BY_TASK_INCREASING);
        }
    }

    dueDateSort = (e) => {
        if(this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING)) {
            this.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING);
        } else {
            this.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING);
        }
    }

    statusSort = (e) => {
        if(this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_INCREASING)) {
            this.sortTasks(ItemSortCriteria.SORT_BY_STATUS_DECREASING);
        } else {
            this.sortTasks(ItemSortCriteria.SORT_BY_STATUS_INCREASING);
        }
    }

    render() {
        const todoList = this.props.todoList;
        const items = todoList.items;
        console.log("ItemsList: todoList.id " + todoList.id);
        return (
            <div className="todo-lists section">

                <div className="card z-depth-1 grey darken-2">
                    <div className="card-content listheader white-text">
                        <div className="row">
                            <div className='col s4 list_item_card_assigned_to' onClick={this.taskSort}>Task</div>
                            <div className='col s3 list_item_card_due_date' onClick={this.dueDateSort}>Due Date</div>
                            <div className="col s2 list_item_card_completed" onClick={this.statusSort}>Status</div>
                        </div>
                    </div>
                </div>

                {items && items.map(function(item) {
                    //item.id = item.key;
                    item.id = items.indexOf(item);
                    return (
                        <Link to={'/todoList/' + todoList.id + "/" + item.id} key={item.key}>
                            <ItemCard todoList={todoList} item={item} />
                        </Link>
                    );})
                    /*item.id = item.key;
                    <Link to={'/todoList/' + todoList.id + "/" + item.id} key={item.key} index={items.indexOf(item)}>
                            <ItemCard todoList={todoList} item={item} />*/
                }

                <div className="card z-depth-1 light-green lighten-4" id="addItemCard">
                    <Link to={'/todoList/' + todoList.id + "/" + "new"}>
                        <i className="material-icons red-text" id="addItemCardContent">add_box</i>
                    </Link>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const todoList = ownProps.todoList;
    return {
        todoList,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'todoLists' },
    ]),
)(ItemsList);