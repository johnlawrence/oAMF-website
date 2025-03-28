const apiKey1 = 'n8n_api_33f654a16bd8eae73787a4566fbc201e701291f1ab3260bfb519483a46e5fc892ebeda865c8ce0f7'
const apiKey2 = 'n8n_api_33f654a16bd8eae73787a4566fbc201e701291f1ab3260bfb519483a46e5fc892ebeda865c8ce0f7'

const webhookUrl1  = 'https://n8n-new.arg.tech/webhook/47c193b6-988b-45af-b777-bff42ca01f4c2'
const webhookUrl2 = 'https://n8n-new.arg.tech/webhook/47c193b6-988b-45af-b777-bff42ca01f3c'

const svgServiceUrl = 'http://svg.amfws.arg.tech'; 

function toggleWorkflows() {
    const isWorkflow1Selected = document.getElementById('workflow1Checkbox').checked;
    const isWorkflow2Selected = document.getElementById('workflow2Checkbox').checked;

    document.getElementById('workflow1').style.display = isWorkflow1Selected ? 'block' : 'none';
    document.getElementById('workflow2').style.display = isWorkflow2Selected ? 'block' : 'none';
}

function sendToSvgService(jsonData) {
    console.log("Sending to SVG Service:", JSON.stringify(jsonData, null, 2));
    const localsvgurl = "https://oamf.arg.tech/helpers/poster.php?svg=1&url=" + svgServiceUrl;

    fetch(localsvgurl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData) // Sending raw JSON
    })
    .then(response => {
        console.log('SVG Service Response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(responseText => {
        console.log('SVG Service Response Body:', responseText);

        // Check if the response contains an SVG
        if (responseText.includes('<svg')) {
            document.getElementById('svgContainer').innerHTML = responseText;
        } else {
            console.error('Received non-SVG content:', responseText);
            document.getElementById('svgContainer').innerHTML = `<span class="error">Error: Invalid SVG content received</span>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('svgContainer').innerHTML = `<span class="error">Error: ${error.message}</span>`;
    });
}

document.getElementById('triggerWebhookButton').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) {
        alert("Please enter text before triggering the workflow.");
        return;
    }
    document.getElementById('triggerWebhookButton').style.display = "none";
    $("body").addClass("loading"); 
    //const selectedWorkflow = document.getElementById('workflow1Checkbox').checked ? webhookUrl1 : webhookUrl2;
    const selectedWorkflow = webhookUrl2;
    const apiKey = selectedWorkflow === webhookUrl1 ? apiKey1 : apiKey2;

    const localurl = "https://oamf.arg.tech/helpers/poster.php?url=" + selectedWorkflow + "&apiKey=" + apiKey;

    fetch(localurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-N8N-API-KEY': apiKey,
            },
            body: JSON.stringify({ text: userInput }),
        })
    .then(response => {
        console.log('Webhook Response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Webhook Response Data:', data);
        document.getElementById("rjson").innerHTML = JSON.stringify(data, null, 2);
        document.getElementById("resultsmodal").style.display = "block";
        sendToSvgService(data); // Send JSON response to SVG service
        document.getElementById('triggerWebhookButton').style.display = "block";
        $("body").removeClass("loading"); 
    })
    .catch(error => {
        console.error('Error:', error);
        //document.getElementById('webhookResponse').innerHTML = `<span class="error">Error: ${error.message}</span>`;
    });
});
