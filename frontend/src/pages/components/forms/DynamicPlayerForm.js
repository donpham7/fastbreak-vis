import ComparisonFields from "./ComparisonFields.js";
import AttributeFields from "./AttributeFields.js";
import SimilarityFields from "./SimilarityFields.js";
import ShotChartFields from "./ShotChartFields.js";




export default function DynamicPlayerForm({activeView, chartProps}) {
    switch(activeView) {
        case "comparison": return <ComparisonFields chartProps={chartProps}/>;
        case "attributes": return <AttributeFields chartProps={chartProps}/>;
        case "similarity": return <SimilarityFields chartProps={chartProps}/>;
        case "shotchart": return <ShotChartFields chartProps={chartProps}/>;
        default: return <ComparisonFields chartProps={chartProps}/>;
    }
}

