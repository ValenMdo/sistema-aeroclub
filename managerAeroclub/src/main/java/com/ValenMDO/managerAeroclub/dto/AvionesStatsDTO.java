package com.ValenMDO.managerAeroclub.dto;

import lombok.Getter;

@Getter
public class AvionesStatsDTO {

    private long total;
    private long disponibles;
    private long mantenimiento;
    private long fuera;


    public AvionesStatsDTO(long total, long disponibles, long mantenimiento, long fuera){
        this.total = total;
        this.disponibles = disponibles;
        this.mantenimiento = mantenimiento;
        this.fuera = fuera;
    }

}
