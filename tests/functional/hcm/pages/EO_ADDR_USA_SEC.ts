import intern from "intern";
import { spawn } from "child_process";

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

const root = __dirname + "../../../../..";
const PRO_WEB_AUTH_TOKEN = process.env.PRO_WEB_AUTH_TOKEN;
const GLOBAL_INTUITIVE_AUTH_TOKEN = process.env.GLOBAL_INTUITIVE_AUTH_TOKEN;

function addGlobalIntuitive() {
  return function() {
    return this.parent
      .execute(function(GLOBAL_INTUITIVE_AUTH_TOKEN, root) {
        let element = document.createElement("div");
        element.id = "edq-9.2-hcm-pages-EO_ADDR_USA_SEC";
        element.setAttribute("GLOBAL_INTUITIVE_AUTH_TOKEN", GLOBAL_INTUITIVE_AUTH_TOKEN);

        let script = document.createElement("script");
        script.src = `http://localhost:8000/lib/9.2/hcm/pages/EO_ADDR_USA_SEC/integration.js`;
      
        document.body.appendChild(element);
        document.body.appendChild(script);
        
      }, [GLOBAL_INTUITIVE_AUTH_TOKEN, root ])
  }
}

function addProWebOnDemand(useTypedown: boolean = false) {
  return function() {
    return this.parent
      .execute(function(PRO_WEB_AUTH_TOKEN, root, useTypedown) {
        let element = document.createElement("div");
        element.id = "edq-9.2-hcm-pages-EO_ADDR_USA_SEC";
        element.setAttribute("PRO_WEB_USE_TYPEDOWN", String(useTypedown));
        element.setAttribute("PRO_WEB_AUTH_TOKEN", PRO_WEB_AUTH_TOKEN);

        let script = document.createElement("script");
        script.src = `http://localhost:8000/lib/9.2/hcm/pages/EO_ADDR_USA_SEC/integration.js`;
      
        document.body.appendChild(element);
        document.body.appendChild(script);
        
      }, [ PRO_WEB_AUTH_TOKEN, root, useTypedown ])
  }
}

function addProWebOnPremise(useTypedown: boolean = false) {
  return function() {
    return this.parent
      .execute(function(root, useTypedown) {
        let element = document.createElement("div");
        element.id = "edq-9.2-hcm-pages-EO_ADDR_USA_SEC";
        element.setAttribute("PRO_WEB_USE_TYPEDOWN", String(useTypedown));
        element.setAttribute("PRO_WEB_SERVICE_URL", "http://bospshcm92dev2.qas.com:8080");

        let script = document.createElement("script");
        script.src = `http://localhost:8000/lib/9.2/hcm/pages/EO_ADDR_USA_SEC/integration.js`;

        document.body.appendChild(element);
        document.body.appendChild(script);

      }, [ root, useTypedown ])
  }
}



function typeAddressAndSubmit(address: any) {
  return function() {
    return this.parent
      .findByCssSelector("#DERIVED_ADDRESS_ADDRESS1")
        .clearValue()
        .type(address.address1 || "")
        .end()
      .findByCssSelector("#DERIVED_ADDRESS_ADDRESS2")
        .clearValue()
        .type(address.address2 || "")
        .end()
      .findByCssSelector("#DERIVED_ADDRESS_CITY")
        .clearValue()
        .type(address.city || "")
        .end()
      .findByCssSelector("#DERIVED_ADDRESS_STATE")
        .clearValue()
        .type(address.state || "")
        .end()
      .findByCssSelector("#DERIVED_ADDRESS_POSTAL")
        .clearValue()
        .type(address.postal || "")
        .end()
      .findByCssSelector("#DERIVED_ADDRESS_OK_PB")
        .click()
        .end()

  };
}

/**
 * The URL to the relevant iframe, EO_ADDR_USA_SEC
 */
const URL = "http://bospshcm92dev2.qas.com/psc/HCM92EXP/EMPLOYEE/HRMS/c/ADMINISTER_WORKFORCE_(GBL).PERSONAL_DATA_ADD.GBL";

registerSuite("EO_ADDR_USA_SEC Tests", {
  before: function() {
    return this.remote
      .setFindTimeout(10000)
      .clearCookies()
      .sleep(1000)
      .get(URL)
      .findByCssSelector("#userid")
      .type("PS")
      .end()
      .findByCssSelector("#pwd")
      .type("PS")
      .end()
      .findByCssSelector("[name='Submit']")
      .click()
      .end()
      .sleep(1000) 
  },

  beforeEach: function() {
    // Go to the page with the address
    return this.remote  
      .sleep(1000)
      .get(URL)
      .findByCssSelector("#DERIVED_HCR_PER_ADD_PERSON_LINK")
        .click()
        .end()
      .sleep(1000) 
      .findByCssSelector("#ICTAB_1")
        .click()
        .end()
      .sleep(1000) 
      .findByLinkText("Add Address Detail")
        .click()
        .end()
      .sleep(1000) 
      .findByLinkText("Add Address")
        .click()
        .end()
      .sleep(4000) 
      .execute(function() { 
        window.EDQ = null;
        window.EdqConfig = null;

        let address1: any = document.getElementById("DERIVED_ADDRESS_ADDRESS1");
        // Remove Typedown Integration
        address1.onclick = null;
        address1.setAttribute("onclick", null);

        // Remove Global Intuitive Integration
        address1.removeEventListener("keyup", address1.keyupHandler);
        address1.removeEventListener("keydown", address1.keydownHandler);

        // Remove all traces of integration
        let okButton = document.getElementById("DERIVED_ADDRESS_OK_PB");
        okButton.onclick = null;
        okButton.setAttribute("onclick", null);

        if (document.getElementById("edq-pegasus")) {
          let pegasus = document.getElementById("edq-pegasus");
          pegasus.remove();
        }

        if (document.getElementById("edq-verification-unicorn")) {
          let verification = document.getElementById("edq-verification-unicorn");
          verification.remove();
        }

        if (document.getElementById("edq-typedown-unicorn")) {
          let typedown = document.getElementById("edq-typedown-unicorn");
          typedown.remove();
        }

        if (document.getElementById("edq-global-intuitive-unicorn")) {
          let globalIntuitive = document.getElementById("edq-global-intuitive-unicorn");
          globalIntuitive.remove();
        }


        if (document.getElementById("edq-9.2-hcm-pages-EO_ADDR_USA_SEC")) {
          let integration = document.getElementById("edq-9.2-hcm-pages-EO_ADDR_USA_SEC");
          integration.remove();
        }

      })
      .sleep(4000)
  },

  tests: {
    "Pro Web without adding integration fails": function() {
      return this.remote
        .then(typeAddressAndSubmit({
          address1: "53 State Street",
          postal: "02109-2820"
        }))
        .sleep(1000)
        .findByCssSelector("#DERIVED_ADDRESS_CITY")
          .getProperty("value")
          .then(function(city: string) {
            assert.equal(city, "", "City is not populated");
          })
          .end()
    },

    "Pro Web with PRO_WEB_AUTH_TOKEN works": function() {
      return this.remote
        .then(addProWebOnDemand())
        .sleep(3000)
        .then(typeAddressAndSubmit({
          address1: "53 State Street",
          postal: "02109-2820"
        }))
        .sleep(3000)
        .findByCssSelector("#DERIVED_ADDRESS_CITY")
          .getProperty("value")
          .then(function(city) {
            assert.equal(city, "Boston", "Full address includes city")
          })
          .end()
    },
    
    "Pro Web with PRO_WEB_SERVICE_URL works": function() {
      return this.remote
        .then(addProWebOnPremise())
        .sleep(3000)
        .then(typeAddressAndSubmit({
          address1: "125 Summer St",
          address2: "Ste 1020",
          city: "Boston",
          postal: "02110"
        }))
        .sleep(2000)
        .findByCssSelector("#DERIVED_ADDRESS_POSTAL")
          .getProperty("value")
          .then(function(postal: string) {
            assert.equal(postal, "02110-1681", "Full address includes ZIP+4")
          })
          .end()
    },

    "Pro Web with PRO_WEB_USE_TYPEDOWN does not work when integration is not properly set": function() {
      return this.remote
        .findByCssSelector("#DERIVED_ADDRESS_ADDRESS1")
          .click()
          .end()
        .execute(function() {
          return document.getElementById("typedown-steps");
        })
        .then(function(domElement) {
          assert.equal(domElement, null, "Typedown Modal should not appear with integration");
        })
    },

    /* TODO: Enable once Typedown-unicorn is uploaded 
    "Pro Web typedown works": function() {
      return this.remote
        .then(addProWebOnPremise(true))
        .sleep(3000)
        .findByCssSelector("#DERIVED_ADDRESS_ADDRESS1")
          .click()
          .end()
        .sleep(1000)
        .findByCssSelector("#typedown-steps")
          .getVisibleText()
        .then(function(typedownText) { 
          assert(Boolean(typedownText), "Typedown pops up");
        })
    },
     */

    "Global Intuitive without adding integration does not work": function() {
      return this.remote
      .findByCssSelector("#DERIVED_ADDRESS_ADDRESS1")
        .type("53 State Street Boston")
        .sleep(1000)
        .end()
      .findByCssSelector("#DERIVED_ADDRESS_ADDRESS1")
        .click()
        .type(" ")
        .sleep(2000)
        .end()
      .execute(function() {
        return document.querySelector(".edq-global-intuitive-address-suggestion")
      })
      .then(function(selector) {
        assert.equal(selector, null, "No suggestions an be found");
      })
        
    },

    "Global Intuitive with GLOBAL_INTUITIVE_AUTH_TOKEN works": function() {
      return this.remote
      .then(addGlobalIntuitive())
      .sleep(3000)  
      .findByCssSelector("#DERIVED_ADDRESS_ADDRESS1")
        .type("53 State Street Boston")
        .sleep(1000)
        .end()
      .findByCssSelector("#DERIVED_ADDRESS_ADDRESS1")
        .click()
        .type(" ")
        .sleep(2000)
        .end()
      .findByCssSelector(".edq-global-intuitive-address-suggestion")
        .click()
        .end()
      .sleep(1000)
      .findByCssSelector("#DERIVED_ADDRESS_CITY")
        .getProperty("value")
        .then(function(city: string) {
          assert.equal(city, "Boston", "Full address includes city")
        })
        .end()
    }
  },

  after: function() {
    return this.remote
      .get("http://bospshcm92dev2.qas.com/psp/HCM92EXP/?cmd=logout&fmode=1")
  }
});

