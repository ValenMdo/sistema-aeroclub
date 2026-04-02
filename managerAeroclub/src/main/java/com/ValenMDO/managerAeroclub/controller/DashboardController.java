package com.ValenMDO.managerAeroclub.controller;

import com.ValenMDO.managerAeroclub.dto.DashboardDTO;
import com.ValenMDO.managerAeroclub.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService service;

    @GetMapping("/stats")
    public DashboardDTO getStats() {
        return service.getStats();
    }
}
