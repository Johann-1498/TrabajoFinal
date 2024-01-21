#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;

my $cgi = CGI->new;

my $token_sesion = $cgi->param('token');
my $new_data = $cgi->param('newdata');
my $decoded_json = decode_json($new_data);
my @claves = keys %$decoded_json;
my @valores = values %$decoded_json;
if ($token_sesion && @claves && @valores) {
    my $datos_usuario = cargar_datos_a_tabla($token_sesion, \@claves, \@valores);
    if ($datos_usuario) {
        print $cgi->header(-type => 'application/json', -status => '200 OK');
        print '{"success": true}';
    } else {
        print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
        print '{"success": false}';
    }
} else {
    print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
    print '{"success": false}';
}

sub cargar_datos_a_tabla {
    my ($token, $claves, $valores) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "UPDATE users SET $claves[0] = ? WHERE token_sesion = ?";
    my $sth = $dbh->prepare($query);
    my $filas_afectadas = $sth->execute($valores[0], $token);
    $dbh->disconnect();
    return $filas_afectadas;
}