package com.ValenMDO.managerAeroclub.repository;

import com.ValenMDO.managerAeroclub.enums.RolesUsarios;
import com.ValenMDO.managerAeroclub.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByRol(RolesUsarios rol);
}
