#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
use Data::Dumper;
my $cgi = CGI->new;
my $token_sesion = $cgi->param("token_sesion");
my $tabla = $cgi->param("tabla");
my $columna = $cgi->param("columna");
my $valor = $cgi->param("valor");
my $userID = $cgi->param("userID");
if ($token_sesion && $columna && $valor && $tabla) {
    my $datos_usuario = cargar_datos_a_tabla($token_sesion, $columna, $valor, $tabla, $userID);
    if ($datos_usuario) {
        print $cgi->header(-type => 'application/json', -status => '200 OK');
        print '{"success": true}';
    } else {
        print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
        print '{"success": "Error en la  bd"}';
    }
    
} else {
    print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
    print '{"success": "error al recibir los datos"}';
}

sub cargar_datos_a_tabla {
    my ($token, $columna, $valor, $tabla, $userID) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    if($tabla eq "users"){
        my $query = "UPDATE users SET $columna = ? WHERE token_sesion = ?";
        my $sth = $dbh->prepare($query);
        my $filas_afectadas = $sth->execute($valor, $token);
        $dbh->disconnect();
        return $filas_afectadas;
    }
    my $query = "UPDATE billing_card SET $columna = ? WHERE id_cliente = ?";
    my $sth = $dbh->prepare($query);
    my $filas_afectadas = $sth->execute($valor, $userID);
    if($filas_afectadas != 0){
        $dbh->disconnect();
        return $filas_afectadas;
    }
    my $queryCreateCard = "INSERT INTO billing_Card (id_cliente, $columna, amount) VALUES (?, ?, 3000)";
    my $sthCreateCard = $dbh->prepare($queryCreateCard);
    $sthCreateCard->execute($userID, $valor);
    my $filas_afectadas_insert = $sthCreateCard->rows;
    $dbh->disconnect();
    return $filas_afectadas_insert;

}