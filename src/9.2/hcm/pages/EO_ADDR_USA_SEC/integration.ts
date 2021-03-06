import { createAssets } from "../../../../functions/create-assets";

let currentElement = document.getElementById("edq-9.2-hcm-pages-EO_ADDR_USA_SEC");

let interval = setInterval(function() {
  if (document.getElementById("DERIVED_ADDRESS_ADDRESS1") !== null){
    clearInterval(interval);

    let trigger: any = document.getElementById("DERIVED_ADDRESS_OK_PB");

    window.EdqConfig = {
      PRO_WEB_SUBMIT_TRIGGERS: [
        {
          type: "click",
          element: trigger
        },
      ],
      PRO_WEB_COUNTRY: "USA",
      PRO_WEB_MAPPING: [
        {
          field: document.getElementById("DERIVED_ADDRESS_ADDRESS1"),
          elements: ["Primary number", "Street"],
          separator: " ",
          modalFieldSelector: "#interaction-address--original-address-line-one",
          typedownFieldSelector: "#typedown-final--address-line-one"
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_ADDRESS2"),
          elements: ["Secondary number"],
          separator: "",
          modalFieldSelector: "#interaction-address--original-address-line-two",
          typedownFieldSelector: "#typedown-final--address-line-two"
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_CITY"),
          elements: ["City name"],
          separator: "",
          modalFieldSelector: "#interaction-address--original-locality",
          typedownFieldSelector: "#typedown-final--city"
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_STATE"),
          elements: ["State code"],
          separator: "",
          modalFieldSelector: "#interaction-address--original-province",
          typedownFieldSelector: "#typedown-final--state"
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_POSTAL"),
          elements: ["ZIP Code", "+4 code"],
          separator: "-",
          modalFieldSelector: "#interaction-address--original-postal-code",
          typedownFieldSelector: "#typedown-final--postal-code"
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_COUNTY"),
          elements: ["County name"],
          separator: "",
          modalFieldSelector: "#"
        },
      ],

      GLOBAL_INTUITIVE_ELEMENT: (document.getElementById("DERIVED_ADDRESS_ADDRESS1") as HTMLInputElement),
      GLOBAL_INTUITIVE_MAPPING: [
        {
          field: document.getElementById("DERIVED_ADDRESS_ADDRESS1"),
          elements: ["address.addressLine1"]
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_ADDRESS2"),
          elements: ["address.addressLine2"],
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_CITY"),
          elements: ["address.locality"]
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_STATE"),
          elements: ["address.province"]
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_POSTAL"),
          elements: ["address.postalCode"]
        },
        {
          field: document.getElementById("DERIVED_ADDRESS_COUNTY"),
          elements: ["components.county1"]
        },
      ]
    };

    const proWebUseTypedown = currentElement.getAttribute("PRO_WEB_USE_TYPEDOWN");
    if (proWebUseTypedown) {
      window.EdqConfig = Object.assign(window.EdqConfig, {
        PRO_WEB_TYPEDOWN_TRIGGER: document.getElementById("DERIVED_ADDRESS_ADDRESS1")
      });
    }

    const globalIntuitiveAuthToken = currentElement.getAttribute("GLOBAL_INTUITIVE_AUTH_TOKEN");
    if (globalIntuitiveAuthToken) {
      window.EdqConfig = Object.assign(window.EdqConfig, {
        GLOBAL_INTUITIVE_AUTH_TOKEN: globalIntuitiveAuthToken
      });
    }

    const proWebAuthToken = currentElement.getAttribute("PRO_WEB_AUTH_TOKEN");
    const proWebServiceUrl = currentElement.getAttribute("PRO_WEB_SERVICE_URL");
    const soapActionUrl = currentElement.getAttribute("SOAP_ACTION_URL") || "http://www.qas.com/web-2013-12";    
    if (proWebAuthToken) {
      window.EdqConfig = Object.assign(window.EdqConfig, {
        PRO_WEB_AUTH_TOKEN: proWebAuthToken,
        PRO_WEB_LAYOUT: "AllElements",
      });
    } else if (proWebServiceUrl && soapActionUrl) {
      window.EdqConfig = Object.assign(window.EdqConfig, {
        PRO_WEB_SERVICE_URL: proWebServiceUrl,
        SOAP_ACTION_URL: soapActionUrl,
        PRO_WEB_LAYOUT: "Peoplesoft",
        
      });
    };

   createAssets(currentElement); 
  }
}, 1000);
