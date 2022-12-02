/**
 * Mòdul per gestionar mides de productes
 * 
 * Com es faran servir les dades dimensionals?
 * 
 * 1. Aplicació de distribució
 *    1a. Optimització de l'espai d'emmagatzematge
 *    1b. Optimització de la selecció d'envasos
 *    1c. Ubicació intel·ligent de productes (slotting)
 * 2. Aplicació de transport/enviament
 *    2a. Registre precís de dimensions i pes
 *    2b. Planificació de càrrega en camions/contenidors
 * 
 * x = amplada, y = llargada, z = alçada, tot en milímetres, volum en litres = x*y*z
 * 
 *       |z /y
 *       | /
 *       |/____x
 *
 * Bibliografia:
 * Definir un cuboide per cada caixa: tenen 6 cares planes i tots els seus costats són rectes.
 * Volum = llarg x ample x altura
 * https://matematicas.uno/cuboides-prismas-rectangulares-y-cubos/
 * Idea: Implementar una cahce i/o guardar totes les combinacions en un volumechew per així no haber de calcular.    
 * 
 */

module.exports = {

    /**
     * Mètode per triar quina caixa s'ha de fer servir per encabir-hi els productes que s'han d'agafar
     * @param {*} pickingBoxes : array ordenat de caixes segons el seu volum (x*y*z). 
     *                           mides interiors de la caixa
     *                           x = amplada, y = llargada, z = alçada, tot en milímetres, volum en litres
     * @param {*} productsToPick : array de productes qua s'han d'agafar amb quantitat, mides i volum (x*y*z). 
     *                             mides exteriors del producte
     *                             x = amplada, y = llargada, z = alçada, tot en milímetres, volum en litres
     * @returns : un objecte amb els camps
     *      boxFound: la caixa més petita que es pot fer servir, null si no se'n troba cap
     *      returnValue: 0 si es troba caixa, negatiu si hi ha error
     *      message: missatge d'error
     *      productsInsideBox: la disposició de productes dins de la caixa trobada
     */
    findPickingBox: function (pickingBoxes, productsToPick) {
        let retObject = {
            message : "",
            returnValue : 0,
            productsInsideBox : [],
            boxFound : null
        }

        // Idea d'algoritme per decidir la ciaxa més petita que es pot fer servir
        // Precondicions:
        // 1. S'ha de tenir les caixes ordenades segons el seu volum, de menys a més
        //
        // Fase 1: decidir la primera caixa utilitzable segons el volum
        // 1. Calcular el volum total dels productes
        // 2. Buscar la caixa amb aquest volum o més gran
        //
        // Fase 2: permutar les ubicacions dels productes per verificar que, encara que tingui prou volum, els productes hi caben
        // 1. Ordenar els productes segons el seu volum, de més a menys
        // 2. Començar per el producte més gran i posar-lo en un extrem de la caixa
        // 3. Anar afegint productes, primer al costat dels productes existents i després a sobre, 
        //    rotar el producte si és possible
        // 4. En el moment en que es sobresurti de la caixa tornar al punt 3
        // 5. Si caben tots els productes a la caixa finalitzar

        // FASE 1
        // Calculem el volum total dels productes
        let productTotalVolume = 0;
        for (let i = 0; i < productsToPick.length; i++) {
            productTotalVolume += productsToPick[i].volume;
        }
        // Busquem la caixa amb aquest volum o més gran
        let firstBoxToUse = -1;
        for (let i = 0; i < pickingBoxes.length; i++) {
            console.log(`box ${pickingBoxes[i].code} volume = ${pickingBoxes[i].volume}, total product volume = ${productTotalVolume}`);
            if (pickingBoxes[i].volume >= productTotalVolume) {
                console.log(`first box with enough capacity = ${pickingBoxes[i].code} [${i}]`);
                firstBoxToUse = i;
                break;
            }
        }

        // Si no hem trobat cap caixa amb suficient volum sortim
        if (firstBoxToUse === -1) {
            retObject.message = 'The total products volume is greater than all boxes';
            retObject.returnValue = -1;
            return retObject;
        }

        // FASE 2
        // permutem les ubicacions dels productes per verificar que, encara que tingui prou volum, els productes hi caben

        // Posem el primer producte a un angle de la caixa, verifiquem que les mides hi caben, 
        // sinó hi cap i es pot rotar el producte, rotem fins que hi càpiga
        // sinó hi cap donem error
        for (let i = firstBoxToUse; i < pickingBoxes.length; i++) {
            for (let j = 0; j < productsToPick.length; j++) {
                // Afegim a les rotacions possibles, com a primera opció, la no rotació
                let rotations = ['n'].concat(productsToPick[j].canRotate);

                for (let k = 0; k < rotations.length; k++) {    // Per cada rotació del producte
                    let productCanBeInside = this.putProductInsideBox(retObject.productsInsideBox, pickingBoxes[i], productsToPick[j], rotations[k]);
                    if (productCanBeInside.result) {
                        console.log(`The product ${productsToPick[j].code} can be fit inside the box ${pickingBoxes[i].code} with rotation ${rotations[k]}`);
                        retObject.productsInsideBox.push(productCanBeInside.productPosition);
                        retObject.boxFound = pickingBoxes[i];
                        retObject.message = '';
                        return retObject;
                    } else {
                        console.log(`The product ${productsToPick[j].code} can not be fit inside the box ${pickingBoxes[i].code} with rotation ${rotations[k]}`);
                    }
                }
            }
        }
        
        retObject.message = `Not found any product combination that can be fit into the boxes`;
        retObject.returnValue = -2;
        return retObject;
    },

    /**
     * 
     * @param {*} productsInsideBox  : [
     *    { "code":"selfpackaging-2536", "x1":, "y1":, "z1":, "x2":, "y2":, "z2": },
     *  ]
     * @param {*} box : { "code":"2in1e-Flex-001", "x":250, "y":200, "z":100, "volume":5 }
     * @param {*} product : { "code":"selfpackaging-2536", "x":62, "y":62, "z":151, "volume":0.580444, "canRotate": ["x", "y"] }
     * @param {*} rotation : 'n', 'x', 'y', 'z'
     */
    putProductInsideBox: function(productsInsideBox, box, product, rotation) {
        let result = {
            result: false,
            productPosition: null
        };

        // Si no hi ha cap producte a dins de la caixa el posem en el primer costat i comprobem si hi cap
        if (productsInsideBox.length === 0) {
            let productRotated = this.rotateProduct(product, rotation);

            let productPos = {
                x1: 0, y1: 0, z1: 0,
                x2: productRotated.x, y2: productRotated.y, z2: productRotated.z
            };

            if (this.productIsInsideBox(productPos, box)) {
                result.productPosition = productPos;
                result.result = true;
                console.log(`Trying product rotated ${rotation} in position ${JSON.stringify(productPos)} into box ${JSON.stringify(box)} FITS`);
            } else {
                console.log(`Trying product rotated ${rotation} in position ${JSON.stringify(productPos)} into box ${JSON.stringify(box)} NO FITS`);
            }

            return result;
        }

        // Per cada producte de dins de la caixa intentem posar el nou producte en un costat, primer el superior lliure
        // i després el lateral lliure. 
        // Nota: sempre tenen el costat inferior i lateral esquerra contra la caixa o contra un altre producte.
        for (let i = 0; i < productsInsideBox.length; i++) {

        }

        // Si no cap en el plà dels productes existents ho posem a sobre
        for (let i = 0; i < productsInsideBox.length; i++) {

        }

        return false;
    },

    /**
     * 
     * @param {*} product : { "code":"selfpackaging-2536", "x":62, "y":62, "z":151, "volume":0.580444, "canRotate": ["x", "y"] },
     * @param {*} rotation : eix de rotació "x" / "y" / "z"
     */
    rotateProduct: function(product, rotation) {
        productRotated = product;

        let oldX = productRotated.x;
        let oldY = productRotated.y;

        switch(rotation) {
            case 'x':   // Rotem sobre l'eix de lex x, la x queda igual, y es converteix en z i z en y
                productRotated.y = productRotated.z;
                productRotated.z = oldY;
                break;
            case 'y':   // Rotem sobre l'eix de lex y, la y queda igual, x es converteix en z i z en x
                productRotated.x = productRotated.z;
                productRotated.z = oldX;
                break;
            case 'z':   // Rotem sobre l'eix de lex z, la z queda igual, y es converteix en x i x en y
                productRotated.y = productRotated.x;
                productRotated.x = oldY;
                break;
            default:
                // no fem res
                break;
        }

        return productRotated;
    },

    /**
     * Indica si el producte cau fora de la caixa
     * @param {*} product 
     * @param {*} box 
     * @returns 
     */
    productIsOutsideBox: function(product, box) {
        return (product.x2 > box.x ||
                product.y2 > box.y ||
                product.z2 > box.z);
    },

    /**
     * Indica si el producte està dins de la caixa
     * @param {*} product 
     * @param {*} box 
     * @returns 
     */
     productIsInsideBox: function(product, box) {
        return (product.x2 <= box.x &&
                product.y2 <= box.y &&
                product.z2 <= box.z);
    }
}  
