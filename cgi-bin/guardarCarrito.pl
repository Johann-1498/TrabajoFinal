#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
use Data::Dumper;
my $cgi = CGI->new;
my $token_sesion = $cgi->param("token_sesion");
my $carrito = $cgi->param("carrito");
if ($token_sesion && $carrito) {
    my $success = cargar_datos_a_tabla($token_sesion, $carrito);
    if ($success) {
        print $cgi->header(-type => 'application/json', -status => '200 OK');
        print '{"success": true' .$success.'}';
    } else {
        print $cgi->header(-type => 'application/json', -status => '500 Internal Server Error');
        print '{"success": "Error en la conexion a bd"}';
    }
} else {
    print $cgi->header(-type => 'application/json', -status => '500 Internal Server Error');
    print '{"success": "error al recibir los datos"}';
}

sub cargar_datos_a_tabla {
    my ($token, $carrito) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    
    my $selectUser = "SELECT id FROM users WHERE token_sesion = ?";
    my $sth = $dbh->prepare($selectUser);
    $sth->execute($token);
    my ($id) = $sth->fetchrow_array;

    my $queryUpdateCarrito = "UPDATE carrito SET content = ? WHERE clientID = ?";
    my $sthUpdateCarrito = $dbh->prepare($queryUpdateCarrito);
    my $filas_afectadas_update = $sthUpdateCarrito->execute($carrito, $id);

    if ($filas_afectadas_update && $filas_afectadas_update != 0) {
        $dbh->disconnect();
        return 1;  # Devuelve true si al menos una fila fue afectada
    }

    my $queryCreateCarrito = "INSERT INTO carrito (clientID, content) VALUES (?, ?)";
    my $sthCreateCarrito = $dbh->prepare($queryCreateCarrito);
    $sthCreateCarrito->execute(int($id), $carrito);

    my $filas_afectadas_insert = $sthCreateCarrito->rows;

    $dbh->disconnect();

    return $filas_afectadas_insert;  # Devuelve el resultado de la operación de inserción
}