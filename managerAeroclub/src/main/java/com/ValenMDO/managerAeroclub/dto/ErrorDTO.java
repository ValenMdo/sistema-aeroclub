package com.ValenMDO.managerAeroclub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDTO {

    @Builder.Default
    private LocalDateTime time = LocalDateTime.now();

    private String code;
    private String message;

    public ErrorDTO(String code, String message) {
        this.code = code;
        this.message = message;
        this.time = LocalDateTime.now();
    }
}
