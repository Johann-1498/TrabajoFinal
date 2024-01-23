#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
my $cgi = CGI->new;
my $token_sesion = $cgi->param('token');
if ($token_sesion) {
        my $datos_usuario = cargar_datos_de_tabla($token_sesion);
        if ($datos_usuario) {
            print $cgi->header(-type => 'application/json', -status => '200 OK');
            print encode_json($datos_usuario);
        } else {
            print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
            print "Error al cargar datos del usuario";
        }
}else{
    print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
    print "Error al obtener el token";
}
sub cargar_datos_de_tabla {
    my ($token) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "SELECT * FROM users WHERE token_sesion = ?";
    my $sth = $dbh->prepare($query);
    $sth->execute($token);
    my $datos_usuario = $sth->fetchrow_hashref;
    $sth->finish;
    $dbh->disconnect;
    return $datos_usuario;
}