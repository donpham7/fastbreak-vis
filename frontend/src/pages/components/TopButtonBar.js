

export default function TopButtonBar({ activeView, setActiveView }) {
    return (
        <div className="columns">
            <div className="column is-one-quarter is-centered">
                <button className="button is-primary"
                    onClick={() => setActiveView("comparison")}
                >
                    Player Comparison
                </button>
            </div>
            <div className="column is-one-quarter is-centered">
                <button className="button is-info"
                    onClick={() => setActiveView("attributes")}
                >
                    Player Attributes
                </button>
            </div>
            <div className="column is-one-quarter is-centered">
                <button className="button is-warning"
                    onClick={() => setActiveView("similarity")}
                >
                    Player Similarity
                </button>
            </div>
            <div className="column is-one-quarter is-centered">
                <button className="button is-danger"
                    onClick={() => setActiveView("tbd")}
                >
                    Player TBD
                </button>
            </div>
        </div>
    );
}
