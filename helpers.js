/*const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    // Verifica si el usuario está autenticado
    if (req.isAuthenticated()) {
        // Verifica el tipo de usuario (administrador, prefecto, etc.)
        const tipoUsuario = req.user.tipoUsuario; // Suponiendo que tienes esta información en el objeto de usuario
        
        // Verifica el tipo de usuario y permite el acceso según corresponda
        if (tipoUsuario === 'Administrador') {
            // Si es administrador, permite el acceso a todas las páginas
            return next();
        } else if (tipoUsuario === 'Prefecto') {
            // Si es prefecto, permite el acceso solo a ciertas páginas
            const paginaPermitida = req.path; // Ruta de la página solicitada
            const paginasPermitidasPrefecto = ['/prefectosAdd.html', '/prefectosMuestra.html']; // Lista de páginas permitidas para prefectos
            
            // Verifica si la página solicitada está en la lista de páginas permitidas para prefectos
            if (paginasPermitidasPrefecto.includes(paginaPermitida)) {
                return next(); // Si es una página permitida, permite el acceso
            } else {
                return res.redirect('/public/index.html'); // Si no es una página permitida, redirige al inicio
            }
        } else {
            // Otros tipos de usuario pueden ser manejados de manera similar
            return res.redirect('/public/index.html'); // Redirige al inicio si no es administrador o prefecto
        }
    } else {
        // Si el usuario no está autenticado, redirige al inicio
        res.redirect('/public/index.html');
    }
};

module.exports = helpers;
*/