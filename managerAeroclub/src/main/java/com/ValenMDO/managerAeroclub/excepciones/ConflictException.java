package com.ValenMDO.managerAeroclub.excepciones;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Data
@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictException extends RuntimeException {
    private String code;
    private HttpStatus status;


    public ConflictException(String code,HttpStatus status ,String message) {
        super(message);
        this.code = code;
        this.status = status;
    }
}
