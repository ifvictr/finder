import React from "react";
import { googleMapsApiKey } from "data.json";

const isProduction = process.env.NODE_ENV === "production";

let stylesStr;
if(isProduction) {
    try {
        stylesStr = require("!raw-loader!../public/styles.css");
    }
    catch(e) {
        console.log(e);
    }
}

const HTML = ({
    htmlAttributes,
    headComponents,
    bodyAttributes,
    preBodyComponents,
    body,
    postBodyComponents
}) => (
    <html {...htmlAttributes}>
        <head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            {headComponents}
            {isProduction && (
                <style
                    id="gatsby-inlined-css"
                    dangerouslySetInnerHTML={{ __html: stylesStr }}
                />
            )}
        </head>
        <body {...bodyAttributes}>
            {preBodyComponents}
            <div
                key="body"
                id="___gatsby"
                dangerouslySetInnerHTML={{ __html: body }}
            />
            {postBodyComponents}
            <script src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`}></script>
        </body>
    </html>
);

export default HTML;