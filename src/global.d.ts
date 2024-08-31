export {}
declare global{
    /**
     * [User-Agent Client Hints API](https://developer.mozilla.org/ja/docs/Web/API/User-Agent_Client_Hints_API)
     */
    declare interface Navigator{
        userAgentData?: NavigatorUAData;
    }
    declare interface NavigatorUAData{
        brands: {
            brand: string,
            version: string
        }[];
    }
}

// interface Navigator{
//     userAgentData: string;
// }