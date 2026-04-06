package com.ValenMDO.managerAeroclub.controller;

import com.ValenMDO.managerAeroclub.dto.ErrorDTO;
import com.ValenMDO.managerAeroclub.excepciones.ConflictException;
import com.ValenMDO.managerAeroclub.excepciones.RequestException;
import com.ValenMDO.managerAeroclub.excepciones.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ErrorController {

    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<ErrorDTO> runtimeExceptionHandler(RuntimeException ex){
        ErrorDTO error = ErrorDTO.builder().code("P-500").message("Ocurrió un error inesperado: " + ex.getMessage()).build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = RequestException.class)
    public ResponseEntity<ErrorDTO> requestExceptionHandler(RequestException ex){
        ErrorDTO error = ErrorDTO.builder().code(ex.getCode()).message("Ocurrió un error: " + ex.getMessage()).build();
        return new ResponseEntity<>(error, ex.getStatus());
    }

    @ExceptionHandler(value = ResourceNotFoundException.class)
    public ResponseEntity<ErrorDTO> resourceNotFoundExceptionHandler(ResourceNotFoundException ex){
        ErrorDTO error = ErrorDTO.builder().code(ex.getCode()).message("Ocurrió un error: " + ex.getMessage()).build();
        return new ResponseEntity<>(error, ex.getStatus());
    }

    @ExceptionHandler(value = ConflictException.class)
    public ResponseEntity<ErrorDTO> conflictExceptionhandler(ConflictException ex){
        ErrorDTO error = ErrorDTO.builder().code(ex.getCode()).message("Ocurrió un error: " + ex.getMessage()).build();
        return new ResponseEntity<>(error, ex.getStatus());
    }

}
