#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
my $cgi = CGI->new;
my $token_sesion = $cgi->param('token');
if ($token_sesion) {
        my $carrito = cargar_datos_de_tabla($token_sesion);
        if ($carrito) {
            print $cgi->header(-type => 'application/json', -status => '200 OK');
            print encode_json($carrito);
        } else {
            print $cgi->header(-type => 'application/json');
            print '{"error": "No se encontro un usuario con el token"}';
        }
}else{
    print $cgi->header(-type => 'application/json');
    print '{"error": "No se recibio el token"}';
}
sub cargar_datos_de_tabla {
    my ($token) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $selectUser = "SELECT id FROM users WHERE token_sesion = ?";
    my $sth = $dbh->prepare($selectUser);
    $sth->execute($token);
    my ($id) = $sth->fetchrow_array;
    my $query = "SELECT content FROM carrito WHERE clientID = ?";
    my $sth2 = $dbh->prepare($query);
    $sth2->execute($id);
    my $carrito = $sth2->fetchrow_hashref;
    if($carrito){
        dbh->disconnect;
        return $carrito;
    }
    my $queryCreateCarrito = "INSERT INTO carrito (clientID, content) VALUES (?, ?)";
    my $sthCreateCarrito = $dbh->prepare($queryCreateCarrito);
    $sthCreateCarrito->execute(int($id), "");
    my $filas_afectadas_insert = $sthCreateCarrito->rows;
    $dbh->disconnect;
    return $filas_afectadas_insert;
}
