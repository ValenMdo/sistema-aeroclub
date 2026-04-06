package com.ValenMDO.managerAeroclub.excepciones;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Data
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    private String code;
    private HttpStatus status;


    public ResourceNotFoundException(String message) {
        super(message);
        this.code = "P-404";
        this.status = HttpStatus.NOT_FOUND;
    }
}
