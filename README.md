# onion-cargo-loading-service

## Descripció

Projecte d'un servei web per determinar si es poden encabir diversos elements
en un contenidor i si es així en quina disposició i ordre.
El servei s'ha de poder desplegar en diferents configuracions:

- Un servidor Ubunbtu amb PM2
- Un servidor Ubuntu amb docker compose
- Un o diversos servidors Ubuntu amb docker swarm
- Kubernetes
- Google Run (Serverless)

El servei es desenvoluparà amb NodeJS, ExpressJS
El loggin es farà amb Morgan i Winston.
Les API REST es faran amb Open API i swagger.

### Disseny de les API REST

Per dissenyar les API REST s'ha de tenir en compte:

- El nivell de granularitat: si la granularitat és molt fina s'exposaran molts
  recursos i obligarà a fer moltes crides per relitzar una operació, en canvi
  si la granularitat és molt grossa hi haurà poca flexibilitat i dificultarà la
  reutilització de l'API. S'ha de triar un equilibri entre:
  - La mida de la resposta
  - El número de crides de la API
  - Mantenibiilitat i reusabilitat
  - Escalabilitat
  - Necessitats del negoci
- Basar el disseny en els objectes del negoci i no en taules de la BD
- Fer servir HATEOAS per donar d'inteligència al client, que a partir d'una
  crida sigui capaç de fer altres crides.
- Gestionar els errors de forma consistent, centralitzar els errors en un
  array JSON pot ser una bona idea. <https://www.rfc-editor.org/rfc/rfc7807>.

Exemple de crida amb HATEOAS:

```javascript
{
 “id”: 1,
 “name”: “Blog”,
 “links”: [
  {
   “href”: “1/posts”,
   “rel”: “posts”,
   “type” : “GET”
   }, 
  {
   “href”: “1/comments”,
   “rel”: “comments”,
   “type” : “GET”
   }
 ]
}
```

Exemple d'array d'errors:

```javascript
{
 “errors”: [
   {
   “code”: “10003”,
   “message”: “invalid address field”
   },
   {
   “code”: “10004”,
   “message”: “birthday field is requried”
   }
   ]
 }
```

## Com treballar amb el projecte

Pojecte hostatjat al GitHub, per col·laborar treballar de la següent manera:

1. Fer un fork del projecte al teu GitHub
2. Clona el codi en local
3. Crea el fitxer config/config.js amb la configuració del servei:
4. Crea una branca, posa-li un bon nom, que indiqui el tipus de canvi (bug,
   fix, feat, doc) i expliqui de que es tracta.
   Ex: "bug:error when array is null"
5. Fes els canvis i guarda'ls en local, cada canvi amb el seu commit, també amb
   un bon nom
6. Ves a la branca principal i sincronitza la teva branca master amb el del
   repositori original
7. Guarda els canvis al teu GitHub
8. Crea el pull request

Fitxer config/config.js d'exemple:

```javascript
module.exports = {
    client: "nom del client que el té desplegat",
    service: "nom del servei"
}
```

Per veure totes les rutes del projecte executar-lo amb: `DEBUG=express:* node bin/www`

Mes info a:

- <https://www.freecodecamp.org/espanol/news/como-hacer-tu-primer-pull-request-en-github/>
- <https://betterprogramming.pub/improve-your-pull-requests-and-code-review-in-6-easy-steps-ecf6dfa1c6d5>
- <https://www.paradigmadigital.com/dev/testeo-api-rest-mocha-chai-http/>
- <https://www.freecodecamp.org/news/how-to-build-explicit-apis-with-openapi/>
- <https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi#readme>

## Log de canvis

V 0.0.0 - Característiques
