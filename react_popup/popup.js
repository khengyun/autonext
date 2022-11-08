'use strict';

function LikeButton() {
    const [liked, setLiked] = React.useState(false);

    if (liked) {
        return 'You liked this!';
    }

    return React.createElement(
        'button',
        {
            onClick: () => setLiked(true),
        },
        'Like'
    );
}

const rootNode = document.getElementById('root');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(LikeButton));