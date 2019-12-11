import React from 'react';
import Button from 'react-materialize/lib/Button';
import Icon from 'react-materialize/lib/Icon';
import { getFirestore } from 'redux-firestore';

class ItemCard extends React.Component {

    handleMove = (e,x) => {
        let index = this.props.todoList.items.indexOf(this.props.item);
        let itemList = this.props.todoList.items;
        itemList[index] = this.props.todoList.items[index+x];
        itemList[index].id = index;
        itemList[index+x] = this.props.item;
        itemList[index+x].id = index+x;
        // update key/id
        
        //console.log("Move: item.id: " + this.props.item);
        const fireStore = getFirestore();
        fireStore.collection("todoLists").doc(this.props.todoList.id).update( {
                items : itemList
        });
        e.preventDefault();
    }

    handleDelete = (e) => {
        let itemList = this.props.todoList.items;
        itemList = itemList.filter(i => i != this.props.item);
        // update key/id
        let index = this.props.todoList.items.indexOf(this.props.item);
        for (let i = index; i<itemList.length; i++) {
            itemList[i].id = i;
        }

        console.log("Delete: item: " + this.props.item);
        const fireStore = getFirestore();
        fireStore.collection("todoLists").doc(this.props.todoList.id).update( {
                items : itemList
        });
        e.preventDefault();
    }

    handleDisabled = (e) => {
        e.preventDefault();
    }

    render() {
        const { item } = this.props;
        
        return (
            <div className="card itemCard z-depth-1 todo-list-link light-green lighten-3">
                <div className="card-content black-text text-darken-3">

                    <div className="row">
                        <span className="col s12 card-title">{item.description}</span>
                        
                            <div className='col s4 list_item_card_assigned_to'>
                                Assigned To: <span className = "assigned_to">{item.assigned_to}</span>
                            </div>
                            <div className='col s3 list_item_card_due_date'>
                                {item.due_date}
                            </div>
                            
                            {item.completed ? 
                                <div className='col s2'><i className="material-icons">event_available</i>&nbsp;Completed</div> : 
                                <div className='col s2'><i className="material-icons">schedule</i>&nbsp;Pending</div>}       

                            <div className="col s3">
                                <Button
                                    floating
                                    fab={{direction: 'left'}}
                                    className="red"
                                    large
                                    icon={<Icon>reorder</Icon>}
                                    >

                                    {this.props.todoList.items.indexOf(item) == 0 ?
                                        <Button floating icon={<Icon>keyboard_arrow_up</Icon>} className="grey" onClick={this.handleDisabled}/> :
                                        <Button floating icon={<Icon>keyboard_arrow_up</Icon>} className="blue" onClick={e=>this.handleMove(e,-1)}/>
                                    }
                                    {this.props.todoList.items.indexOf(item) == this.props.todoList.items.length-1 ?
                                        <Button floating icon={<Icon>keyboard_arrow_down</Icon>} className="grey" onClick={this.handleDisabled}/> :
                                        <Button floating icon={<Icon>keyboard_arrow_down</Icon>} className="green" onClick={e=>this.handleMove(e,1)}/>
                                    }
                                    <Button floating icon={<Icon>delete</Icon>} className="yellow darken-2" onClick={e=>this.handleDelete(e)}/>
                                    
                                </Button>  
                            </div>

                    </div>

                </div>
            </div>
        );
    }
}
export default ItemCard;