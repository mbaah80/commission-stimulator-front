import {Text} from "@shopify/polaris";
import React from "react";

export const Index = ({product, key}) => {
    return (
        <div key={key}>
            <Text as="span">
                Product   {product.name} - Price {product.price} - Commission Percentage {product.commissionPercentage} - Earning {product.commission}
            </Text>
        </div>
    )
}

export default Index;