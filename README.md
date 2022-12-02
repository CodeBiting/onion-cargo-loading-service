# onion-cargo-loading-service

## Descripció

Projecte ExpressJS amb vistes PUG i logging amb Morgan i Winston configurats
per logar a fitxers.

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

Mes info a:

- <https://www.freecodecamp.org/espanol/news/como-hacer-tu-primer-pull-request-en-github/>
- <https://betterprogramming.pub/improve-your-pull-requests-and-code-review-in-6-easy-steps-ecf6dfa1c6d5>
- <https://www.paradigmadigital.com/dev/testeo-api-rest-mocha-chai-http/>

## Log de canvis

V 0.0.0 - Característiques
