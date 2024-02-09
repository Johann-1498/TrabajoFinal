#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
my $cgi = CGI->new;
my $email = $cgi->param('email');
if ($email) {
        my $data = cargar_datos_de_tabla($email);
        if ($data) {
            print $cgi->header(-type => 'application/json', -status => '200 OK');
            print encode_json($data);
        } else {
            print $cgi->header(-type => 'application/json');
            print '{"error": "No se encontraron compras aun"}';
        }
}else{
    print $cgi->header(-type => 'application/json');
    print '{"error": "No se recibio el email"}';
}
sub cargar_datos_de_tabla {
    my ($email) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "SELECT * FROM ventas WHERE email = ?";
    my $sth = $dbh->prepare($query);
    $sth->execute($email);
    my @data;
    while(my $fila = $sth->fetchrow_hashref) {
        push @data, $fila;
    }
    $sth->finish;
    $dbh->disconnect;
    return \@data; 
}