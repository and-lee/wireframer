import React from 'react';

class WireframeCard extends React.Component {

    render() {
        const { wireframe } = this.props;
        console.log("WireframeCard, wireframe.id: " + wireframe.id);
        return (
            <div className="card z-depth-1 todo-list-link light-green lighten-3">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{wireframe.name}</span>
                </div>
            </div>
            // add delete X
        );
    }
}
export default WireframeCard;