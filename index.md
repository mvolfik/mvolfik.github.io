## Resume

---

Hello there! My name is Matěj and I'm from Tábor, Czech republic, where I'm studying 3rd
grade of high school. **I'm currently looking for an internship or a part-time job
I could do while studying.** Here you can find a showcase of what I can do and what I've
done.

You can see my preferred technologies in the column below my photo. Until quite recently
I considered Python my strongest point, but in March I learned Svelte and frontend became
a pleasure again. I still don't know the big frameworks like React or Vue, though I'd
still like to learn them one day. However, I'm a a terrible frontend designer, and not
even Bootstrap or Bulma helped me.

### Projects

#### [Python mailmerge](https://github.com/mvolfik/mailmerge)

A simple but fully functional mailmerge script written in Python using Jinja and Markdown.

#### [Bakatasklist](https://github.com/mvolfik/Bakalari-homework-tasklist)

A simple web app for better management of homework. This rushed project is not usable
anymore due to external API deprecation. I created this during first COVID-19 lockdown in
March 2020, because at that time, our school IT system turned out to be completely
unusable for student once there are more than a few assignments.

#### [Homework – Fully Merged List](https://github.com/mvolfik/homework-fml)

A second iteration of the above. I started making this in October 2020, when the second
lockdown wave struck, but then I got stuck on designing the frontend, and Bakaláři
(the _mostly harmless_ Czech school IT system) implemented the main feature my app was
bringing to the table, so the work on this stopped. But I'm still proud of the API
abstractions I pulled off and would like to finish this one day&hellip;

#### [EYP Calls scraper](https://github.com/mvolfik/eyp-calls)

A scraper + simple presentation of participant calls from the European Youth Parliament
members platform. Utilizing Python Scrapy + Cloudflare Workers

#### [Starlette Websockets demo](https://github.com/mvolfik/starlette-websockets-demo)

A a demo of using the Python [Starlette](https://github.com/encode/starlette)
framework for websockets-based server to client notifications. The server can dynamically
create and delete channels, which are advertised to the connected clients. The clients
can then individually subscribe to each channel and receive the notifications. I created
this to learn Starlette and Websockets, as I'm planning to use a similar architecture
for a project I'm planning to do.


#### Finding ways how to host stuff for free

Seriously. Bodge together some Heroku, Cloudflare reverse-proxy + workers free tiers,
Freenom .tk free domains and ImprovMX+Gmail+DKIM and you have a full webhosting including
automated emails for free.

The [email thing][1] is probably my favourite part: [ImprovMX](https://improvmx.com) can
"host" emails on your domain for free in a simple way – they forward them to your own
address. So I registered one Gmail account dedicated for this. But now what about the
sending? For this, you can use the good old _"send email as somebody else"_. Even Gmail
allows you to do that, after verifying you actually have access to the address. But it has
a small issue: anyone could do this from their own server, and some clients might show
alerts. Gmail itself shows `via gmail.com` too. Solution to this is DKIM signing – storing
public keys in DNS is, in my opinion, pretty ingenious.

#### Ingress tools

[Ingress](https://ingress.com) is an augmented reality GPS game, where you visit places,
connect them with links and draw triangles on a global map (this is a significant
oversimplification). As this is a battle of two factions, both factions build some tools
to gain tactical advantage. I have written some tools myself, but can't show them
publicly, because Opsec and some of them live on the border of Ingress ToS. If you want to
see some of my more algorithmic code, reach out, I'll be happy to show you some parts.  

[1]: https://github.com/mvolfik/homework-fml/blob/6b149c/homework_fml/email.py#L23

#### [Rickroll disguiser](https://newsfeedmerge.herokuapp.com/)

Probably my first complete project. A simple web app that lets you create URLs with fake
Open Graph metadata, but redirecting victims to Youtube videos, troll pages, you name it.
