document.addEventListener("DOMContentLoaded", () => {
  const horariosDisponibles = [
    "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
  ];

  const fechaCita = document.getElementById("fecha-cita");
  const horaCita = document.getElementById("hora-cita");

  fechaCita.addEventListener("change", () => {
    if (fechaCita.value) {
      horaCita.disabled = false;
      horaCita.innerHTML = '<option value="">Seleccione un horario</option>';

      const horariosAleatorios = obtenerHorariosAleatorios(horariosDisponibles, 3);
      horariosAleatorios.forEach(hora => {
        horaCita.appendChild(new Option(hora, hora));
      });
    } else {
      horaCita.disabled = true;
      horaCita.innerHTML = '<option value="">Seleccione un horario</option>';
    }
  });

  document.querySelector("#form-agendar form").addEventListener("submit", confirmarCita);

  // Especialidades y médicos
  const especialidad = document.getElementById("especialidad");
  const medico = document.getElementById("medico");

  especialidad.addEventListener("change", () => {
    const valor = especialidad.value;
    medico.innerHTML = '<option value="">Seleccione médico</option>';

    if (valor === "Pediatría") {
      medico.innerHTML += `
        <option value="Dra. Ana López">Dra. Ana López</option>
        <option value="Dr. Juan Pérez">Dr. Juan Pérez</option>
      `;
    } else if (valor === "Dermatología") {
      medico.innerHTML += `
        <option value="Dr. Carlos Mendoza">Dr. Carlos Mendoza</option>
        <option value="Dra. Laura Vargas">Dra. Laura Vargas</option>
      `;
    } else if (valor === "Medicina General") {
      medico.innerHTML += `
        <option value="Dr. Sergio Torres">Dr. Sergio Torres</option>
        <option value="Dra. Paula Ramírez">Dra. Paula Ramírez</option>
      `;
    }

    medico.disabled = false;
  });
});

function confirmarCita(event) {
  event.preventDefault();

  const especialidad = document.getElementById("especialidad").value;
  const medico = document.getElementById("medico").value;
  const fecha = document.getElementById("fecha-cita").value;
  const hora = document.getElementById("hora-cita").value;
  const resultadoCita = document.getElementById("resultado-cita");
  const formAgendar = document.getElementById("cita-form");
  const confirmacionCita = document.getElementById("confirmacion-cita");
  const detalleCita = document.getElementById("detalle-cita");

  if (!especialidad || !medico || !fecha || !hora) {
    resultadoCita.innerText = "⚠️ Por favor complete todos los campos";
    resultadoCita.style.color = "red";
    return;
  }

  formAgendar.classList.add("oculto");
  confirmacionCita.classList.remove("oculto");

  detalleCita.innerText =
    `Tienes agendada una cita de ${especialidad} con ${medico} el ${fecha} a las ${hora}.`;
}

function obtenerHorariosAleatorios(horarios, cantidad) {
  const copia = [...horarios];
  const seleccionados = [];

  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const index = Math.floor(Math.random() * copia.length);
    seleccionados.push(copia.splice(index, 1)[0]);
  }
  return seleccionados.sort();
}
