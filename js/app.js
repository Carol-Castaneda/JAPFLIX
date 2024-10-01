document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('lista');
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    let moviesData = [];

    // Cargar las películas cuando se cargue la página, pero no mostrarlas aún
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => response.json())
        .then(data => {
            moviesData = data;
        })
        .catch(error => console.error('Error al obtener los datos:', error));

    // Función para renderizar la lista de películas
    const renderMovies = (movies) => {
        lista.innerHTML = '';  // Limpiar la lista de películas
        if (movies.length === 0) {
            lista.innerHTML = '<li class="list-group-item text-light bg-dark">No se encontraron resultados.</li>';
        } else {
            movies.forEach((movie, index) => {
                const movieItem = document.createElement('li');
                movieItem.classList.add('list-group-item', 'bg-dark', 'text-light', 'my-3');
                movieItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5>${movie.title}</h5>
                            <p><em>${movie.tagline}</em></p>
                            <p>Valoración: ${generateStars(movie.vote_average)}</p>
                        </div>
                        <button class="btn btn-info" id="toggleButton${index}" type="button" style="font-size: 0.8rem;" data-bs-toggle="collapse" data-bs-target="#movieDetails${index}" aria-expanded="false" aria-controls="movieDetails${index}">
                            Ver más
                        </button>
                    </div>

                    <div class="collapse" id="movieDetails${index}">
                        <div class="card card-body bg-dark text-light mt-2" style="font-size: 0.8rem;"> <!-- Estilo para texto pequeño -->
                            <p><strong>Año de lanzamiento:</strong> ${movie.release_date.split('-')[0]}</p>
                            <p><strong>Duración:</strong> ${movie.runtime} mins</p>
                            <p><strong>Presupuesto:</strong> $${movie.budget.toLocaleString('de-DE')}</p>
                            <p><strong>Ganancias:</strong> $${movie.revenue.toLocaleString('de-DE')}</p>
                            <p><strong>Géneros:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
                            <p><strong>Descripción:</strong> ${movie.overview}</p>
                        </div>
                    </div>
                `;

                lista.appendChild(movieItem);

                // Escuchar eventos de colapso para cambiar el texto del botón
                const collapseElement = document.getElementById(`movieDetails${index}`);
                const toggleButton = document.getElementById(`toggleButton${index}`);

                collapseElement.addEventListener('show.bs.collapse', () => {
                    toggleButton.innerHTML = 'Ver menos'; // Cambia el texto a "Ver menos" cuando se expande
                });

                collapseElement.addEventListener('hide.bs.collapse', () => {
                    toggleButton.innerHTML = 'Ver más'; // Cambia el texto a "Ver más" cuando se minimiza
                });
            });
        }
    };

    // Función para generar estrellas según la valoración
    const generateStars = (voteAverage) => {
        let stars = '';
        const totalStars = 5; // Escala de 5 estrellas
        const starScore = voteAverage / 2; // Convertimos el puntaje a escala de 5

        // Crear estrellas llenas, medias y transparentes (sin fondo)
        for (let i = 1; i <= totalStars; i++) {
            if (i <= Math.floor(starScore)) {
                // Estrella llena dorada
                stars += `<span class="fa fa-star" style="color: gold;"></span>`;
            } else if (i === Math.ceil(starScore) && !Number.isInteger(starScore)) {
                // Media estrella dorada
                stars += `<span class="fa fa-star-half-o" style="color: gold;"></span>`;
            } else if (i === totalStars) {
                // Última estrella vacía con borde dorado
                stars += `<span class="fa fa-star-o" style="color: gold;"></span>`;
            } else {
                // Estrella completamente transparente
                stars += `<span class="fa fa-star" style="color: transparent;"></span>`;
            }
        }
        return stars;
    };

    // Función para filtrar y mostrar las películas según la búsqueda
    btnBuscar.addEventListener('click', () => {
        const searchValue = inputBuscar.value.toLowerCase().trim();
        
        // Verificar si el campo de búsqueda tiene algún valor
        if (searchValue === "") {
            lista.innerHTML = '<li class="list-group-item text-light bg-dark">Por favor, ingrese un valor de búsqueda.</li>';
            return;
        }

        const filteredMovies = moviesData.filter(movie => {
            return (
                movie.title.toLowerCase().includes(searchValue) ||
                movie.tagline.toLowerCase().includes(searchValue) ||
                movie.overview.toLowerCase().includes(searchValue) ||
                movie.genres.some(genre => genre.name.toLowerCase().includes(searchValue)) // Ajuste para géneros
            );
        });
        renderMovies(filteredMovies);
    });
});
