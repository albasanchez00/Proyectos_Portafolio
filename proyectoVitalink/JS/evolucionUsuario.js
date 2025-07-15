document.addEventListener("DOMContentLoaded", function () {
    // 📈 Gráfico: Evolución del Paciente
    const ctxEvolucion = document.getElementById('graficoEvolucion')?.getContext('2d');
    if (ctxEvolucion) {
        new Chart(ctxEvolucion, {
            type: 'line',
            data: {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                datasets: [{
                    label: 'Porcentaje de mejora (%)',
                    data: [60, 72, 80, 90],
                    borderColor: '#2980b9',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: true } }
            }
        });
    }

    // 📊 Gráfico: Frecuencia de Síntomas Reportados
    const ctxSintomas = document.getElementById('graficoSintomas')?.getContext('2d');
    if (ctxSintomas) {
        new Chart(ctxSintomas, {
            type: 'bar',
            data: {
                labels: ['Dolor', 'Fiebre', 'Cansancio', 'Vómitos'],
                datasets: [{
                    label: 'Nº de veces reportado',
                    data: [4, 2, 6, 1],
                    backgroundColor: ['#e67e22', '#c0392b', '#27ae60', '#8e44ad']
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                plugins: { legend: { display: false } }
            }
        });
    }

    // 🥧 Gráfico: Asistencia a Citas
    const ctxCitas = document.getElementById('graficoCitas')?.getContext('2d');
    if (ctxCitas) {
        new Chart(ctxCitas, {
            type: 'pie',
            data: {
                labels: ['Asistidas', 'No asistidas'],
                datasets: [{
                    data: [12, 3],
                    backgroundColor: ['#2ecc71', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
});
