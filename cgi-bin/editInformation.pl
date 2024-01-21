#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
use Data::Dumper;

my $cgi = CGI->new;
my $token_sesion = $cgi->param("token_sesion");
my $columna = $cgi->param("columna");
my $valor = $cgi->param("valor");
print '{"token_sesion":"' . $token_sesion . '","columna":"' . $columna . '","valor":"' . $valor . '"}';
if ($token_sesion && $columna && $valor) {
    my $datos_usuario = cargar_datos_a_tabla($token_sesion, $columna, $valor);
    if ($datos_usuario) {
        print $cgi->header(-type => 'application/json', -status => '200 OK');
        print '{"success": true}';
    } else {
        print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
        print '{"success": "error en la conexion a bd"}';
    }
} else {
    print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
    print '{"success": "error al rcibir los datos"}';
}

sub cargar_datos_a_tabla {
    my ($token, $columna, $valor) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "UPDATE users SET $columna = ? WHERE token_sesion = ?";
    my $sth = $dbh->prepare($query);
    my $filas_afectadas = $sth->execute($valor, $token);
    $dbh->disconnect();
    return $filas_afectadas;
}