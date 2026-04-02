package com.ValenMDO.managerAeroclub.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardDTO {
    public int vuelosHoy;
    public double horasVoladas;
    public int avionesDisponibles;
    public int mantenimientosPendientes;
}
