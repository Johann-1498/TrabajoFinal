#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
my $cgi = CGI->new;
my $token_sesion = $cgi->param('token_sesion');
my $operation = $cgi->param("operation");
if ($token_sesion) {
        my $consulta_validada = autenticar_usuario($token_sesion);  
        if ($consulta_validada) {
            if($operation eq "delete"){
                my $email = $cgi->param("email");
                if(deleteUser($email) > 0){
                    print $cgi->header(-type => 'application/json', -status => '200 OK');
                    print '{"success" : "Usuario Eliminado Exitosamente"}';
                }else{
                    print $cgi->header(-type => 'application/json', -status => '500 Internal Server Error');
                    print '{"success" : "Hubo Un Error al Borrar Al Usuario"}';
                }
            }else{
                my $id = int($cgi->param("id"));
                my $name = $cgi->param("name");
                my $email = $cgi->param("email");
                my $password = $cgi->param("password");
                my $phone = int($cgi->param("phone"));
                my $direccion = $cgi->param("direccion");
                my $rol = $cgi->param("rol");
                if(updateUser($id,$name,$email,$password,$phone,$direccion,$rol) > 0){
                    print $cgi->header(-type => 'application/json', -status => '200 OK');
                    print '{"success" : "Usuario Actualizado Exitosamente"}';
                }else{
                    print $cgi->header(-type => 'application/json', -status => '500 Internal Server Error');
                    print '{"success" : "Hubo Un Error Al Actualizar Al Usuario"}';
                }
            }
        } else {
            print $cgi->header(-type => 'application/json', -status => '500 Internal Server Error');
            print '{"success" : "Usted no tiene permisos de hacer esta operacion"}';
        }
}else{
    print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
    print  '{"success" : "Error al obtener el token"}';
}
sub autenticar_usuario {
    my ($token) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "SELECT * FROM users WHERE token_sesion = ? AND (rol = 'superAdmin' OR rol = 'admin')";
    my $sth = $dbh->prepare($query);
    $sth->execute($token);
    my $consulta_validada = $sth->fetchrow_hashref;
    $sth->finish;
    $dbh->disconnect;
    return $consulta_validada;
}
sub deleteUser {
    my ($email) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "DELETE FROM users WHERE email = ?";
    my $sth = $dbh->prepare($query);
    my $filaAfectada = $sth->execute($email);
    $dbh->disconnect();
    return $filaAfectada;
}
sub updateUser {
    my ($id, $name, $email, $password, $phone, $direccion, $rol) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "UPDATE users SET name = ?, email = ?, password = ?, phone = ?, direccion = ?, rol = ? WHERE id = ?";
    my $sth = $dbh->prepare($query);
    $sth->bind_param(1, $name);
    $sth->bind_param(2, $email);
    $sth->bind_param(3, $password);
    $sth->bind_param(4, $phone);
    $sth->bind_param(5, $direccion);
    $sth->bind_param(6, $rol);
    $sth->bind_param(7, $id);
    my $filas_afectadas = $sth->execute();
    $dbh->disconnect();
    return $filas_afectadas;
}