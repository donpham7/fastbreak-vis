import { ComparisonFields, AttributeFields, SimilarityFields, ShotChartFields } from '@pages/Player/DynamicPlayerForm';

export default function DynamicPlayerForm({activeView, chartProps}) {
    switch(activeView) {
        case "comparison": return <ComparisonFields chartProps={chartProps}/>;
        case "attributes": return <AttributeFields chartProps={chartProps}/>;
        case "similarity": return <SimilarityFields chartProps={chartProps}/>;
        case "shotchart": return <ShotChartFields chartProps={chartProps}/>;
        default: return <ComparisonFields chartProps={chartProps}/>;
    }
}

