import ComparisonFields from "./ComparisonFields.js";
import AttributeFields from "./AttributeFields.js";
import SimilarityFields from "./SimilarityFields.js";
import TBDFields from "./TBDFields.js";




export default function DynamicPlayerForm({activeView, chartProps}) {
    switch(activeView) {
        case "comparison": return <ComparisonFields chartProps={chartProps}/>;
        case "attributes": return <AttributeFields chartProps={chartProps}/>;
        case "similarity": return <SimilarityFields chartProps={chartProps}/>;
        case "tbd": return <TBDFields chartProps={chartProps}/>;
        default: return <ComparisonFields chartProps={chartProps}/>;
    }
}

