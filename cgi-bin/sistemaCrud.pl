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
            if($operation == "delete"){
                my $email = $cgi->param("email");
                deleteUser($email);
                print $cgi->header(-type => 'application/json', -status => '200 OK');
                print '{"success" : "Usuario Eliminado Exitosamente"}';
            }else{
                my $id = $cgi->param("id");
                my $name = $cgi->param("name");
                my $email = $cgi->param("email");
                my $password = $cgi->param("password");
                my $phone = $cgi->param("phone");
                my $cui = $cgi->param("cui");
                my $rol = $cgi->param("rol");
                updateUser($id,$name,$email,$password,$phone,$cui,$rol);
                print $cgi->header(-type => 'application/json', -status => '200 OK');
                print ;
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
    $sth->execute($email);
    $sth->finish;
    $dbh->disconnect;
}
sub updateUser {
    my ($id,$name,$email,$password,$phone,$cui,$rol) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "UPDATE users SET name = ?, email = ?, password = ?, phone = ?, cui = ?, rol = ? WHERE id = ?";
    my $sth = $dbh->prepare($query);
    $sth->execute($name, $email, $password, $phone, $cui, $rol, $id);
    $sth->finish;
    $dbh->disconnect;
}